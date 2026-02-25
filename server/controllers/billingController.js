/**
 * billingController.js — Full billing system
 *
 * Supports dues (rent/fines/deposits), Razorpay online payments,
 * cash payment recording, late-fee application, and invoice generation.
 *
 * Owner routes:
 *   POST /api/billing/dues                  — create a due for a student
 *   GET  /api/billing/owner/dues            — list owner's dues (paginated)
 *   POST /api/billing/dues/:id/record-cash  — record cash payment for a due
 *   POST /api/billing/dues/:id/apply-late-fee — apply late fee to a due
 *
 * Student routes:
 *   GET  /api/billing/my-dues               — student's dues with late fee info
 *   POST /api/billing/dues/:id/create-order — create Razorpay order for a due
 *   POST /api/billing/dues/:id/verify       — verify Razorpay payment (idempotent)
 *   GET  /api/billing/my-invoices           — student's invoices (paginated)
 */

const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Due = require("../models/Due");
const Transaction = require("../models/Transaction");
const Invoice = require("../models/Invoice");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const logger = require("../middleware/logger");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Calculate late fee for a due based on the hostel's lateFeePolicy.
 * Returns the fine amount (0 if no policy or within grace period).
 */
function calculateLateFee(due, hostel) {
  const policy = hostel?.paymentSettings?.lateFeePolicy;
  if (!policy?.enabled) return 0;
  if (due.status === "PAID" || due.status === "WAIVED" || due.status === "CANCELLED") return 0;

  const now = new Date();
  const gracePeriodEnd = new Date(due.dueDate);
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + (policy.gracePeriodDays || 5));

  if (now <= gracePeriodEnd) return 0;

  if (policy.type === "PERCENTAGE") {
    return Math.round(due.amount * policy.value / 100);
  }
  return policy.value || 0;
}

/**
 * Generate a unique invoice number.
 */
function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  return `INV-${year}-${Date.now().toString().slice(-6)}${rand.slice(0, 4)}`;
}

// ============================================================================
// OWNER ACTIONS
// ============================================================================

/**
 * Create a due for a student
 * @route POST /api/billing/dues
 */
exports.createDue = async (req, res) => {
  try {
    const { studentId, title, type, amount, dueDate, remarks } = req.body;
    const ownerId = req.user.id;

    if (!studentId || !amount || !dueDate) {
      return res.status(400).json({ error: "studentId, amount, and dueDate are required" });
    }

    // Verify student belongs to this owner
    const student = await Student.findOne({ _id: studentId, owner: ownerId, status: "Active" });
    if (!student) {
      return res.status(404).json({ error: "Active student not found or not owned by you" });
    }

    const hostel = await Hostel.findById(student.currentHostel);
    if (!hostel) {
      return res.status(404).json({ error: "Student's hostel not found" });
    }

    const due = new Due({
      student: student._id,
      hostel: student.currentHostel,
      owner: ownerId,
      title: title || `${type || "RENT"} - ${new Date(dueDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`,
      type: type || "RENT",
      amount: Number(amount),
      dueDate: new Date(dueDate),
      remarks,
    });

    await due.save();

    logger.info(`Due created: dueId=${due._id} student=${student._id} amount=${amount}`);

    // Enqueue due reminder email (non-blocking)
    try {
      const { addEmailJob } = require("../queues/emailQueue");
      if (addEmailJob) {
        await addEmailJob("due-reminder", {
          studentName: student.name,
          studentEmail: student.email,
          hostelName: hostel.name,
          title: due.title,
          amount: due.amount,
          dueDate: due.dueDate,
        });
      }
    } catch (emailErr) {
      logger.warn("Failed to enqueue due-reminder email: " + emailErr.message);
    }

    res.status(201).json({ message: "Due created successfully", due });
  } catch (err) {
    logger.error("Error creating due: " + err.message);
    res.status(500).json({ error: "Failed to create due" });
  }
};

/**
 * Get all dues for owner's students (paginated)
 * @route GET /api/billing/owner/dues?status=PENDING&page=1&limit=20
 */
exports.getOwnerDues = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = { owner: ownerId };
    if (req.query.status) filter.status = req.query.status;

    const [dues, total] = await Promise.all([
      Due.find(filter)
        .populate("student", "name email phone roomNumber")
        .populate("hostel", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Due.countDocuments(filter),
    ]);

    res.json({
      dues,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    logger.error("Error fetching owner dues: " + err.message);
    res.status(500).json({ error: "Failed to fetch dues" });
  }
};

/**
 * Record a cash payment for a due (owner)
 * @route POST /api/billing/dues/:id/record-cash
 */
exports.recordCashPayment = async (req, res) => {
  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();

  try {
    const { amount, remarks } = req.body;
    const ownerId = req.user.id;
    const { id: dueId } = req.params;

    if (!amount || amount < 1) {
      await dbSession.abortTransaction();
      return res.status(400).json({ error: "Invalid amount" });
    }

    const due = await Due.findOne({ _id: dueId, owner: ownerId }).session(dbSession);
    if (!due) {
      await dbSession.abortTransaction();
      return res.status(404).json({ error: "Due not found or not owned by you" });
    }

    if (due.status === "PAID" || due.status === "WAIVED" || due.status === "CANCELLED") {
      await dbSession.abortTransaction();
      return res.status(400).json({ error: `Due is already ${due.status.toLowerCase()}` });
    }

    const paidAmt = Number(amount);
    const totalDue = due.amount + due.fineAmount;

    // Create transaction
    const transaction = new Transaction({
      student: due.student,
      hostel: due.hostel,
      owner: ownerId,
      due: due._id,
      amount: paidAmt,
      mode: "CASH",
      status: "SUCCESS",
      referenceId: `CASH-${Date.now()}`,
      verifiedBy: ownerId,
      remarks: remarks || "Cash payment recorded by owner",
      date: new Date(),
    });
    await transaction.save({ session: dbSession });

    // Update due
    due.paidAmount = (due.paidAmount || 0) + paidAmt;
    due.transactions.push(transaction._id);
    if (due.paidAmount >= totalDue) {
      due.status = "PAID";
    } else if (due.paidAmount > 0) {
      due.status = "PARTIAL";
    }
    await due.save({ session: dbSession });

    // Generate invoice
    const invoice = new Invoice({
      transaction: transaction._id,
      student: due.student,
      hostel: due.hostel,
      invoiceNumber: generateInvoiceNumber(),
      amount: paidAmt,
      items: [{ description: `${due.title} (Cash)`, amount: paidAmt }],
    });
    await invoice.save({ session: dbSession });

    transaction.invoice = invoice._id;
    await transaction.save({ session: dbSession });

    await dbSession.commitTransaction();

    logger.info(`Cash payment recorded: dueId=${dueId} amount=${paidAmt} invoiceId=${invoice._id}`);

    res.status(200).json({
      message: "Cash payment recorded successfully",
      transaction,
      invoice,
      due: { id: due._id, status: due.status, paidAmount: due.paidAmount },
    });
  } catch (err) {
    await dbSession.abortTransaction();
    logger.error("Error recording cash payment: " + err.message);
    res.status(500).json({ error: "Failed to record payment" });
  } finally {
    dbSession.endSession();
  }
};

/**
 * Apply late fee to a due (owner action — permanently records the fine)
 * @route POST /api/billing/dues/:id/apply-late-fee
 */
exports.applyLateFee = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id: dueId } = req.params;

    const due = await Due.findOne({ _id: dueId, owner: ownerId });
    if (!due) return res.status(404).json({ error: "Due not found" });

    if (due.status === "PAID" || due.status === "WAIVED") {
      return res.status(400).json({ error: `Cannot apply late fee to a ${due.status.toLowerCase()} due` });
    }

    const hostel = await Hostel.findById(due.hostel);
    const computedFine = calculateLateFee(due, hostel);

    if (computedFine === 0) {
      return res.status(400).json({
        error: "No late fee applicable (policy not enabled, due not overdue, or within grace period)",
      });
    }

    due.fineAmount = computedFine;

    // Mark as OVERDUE if still unpaid past due date
    if (due.status === "PENDING" && new Date() > new Date(due.dueDate)) {
      due.status = "OVERDUE";
    }

    await due.save();

    res.json({ message: `Late fee of ₹${computedFine} applied`, due });
  } catch (err) {
    logger.error("Error applying late fee: " + err.message);
    res.status(500).json({ error: "Failed to apply late fee" });
  }
};

// ============================================================================
// STUDENT ACTIONS
// ============================================================================

/**
 * Get student's dues (paginated, with computed late fee info)
 * @route GET /api/billing/my-dues?status=PENDING&page=1&limit=20
 */
exports.getMyDues = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const filter = { student: student._id };
    if (req.query.status) filter.status = req.query.status;

    const [dues, total, hostel] = await Promise.all([
      Due.find(filter)
        .populate("hostel", "name paymentSettings")
        .sort({ dueDate: 1 })
        .skip(skip)
        .limit(limit),
      Due.countDocuments(filter),
      student.currentHostel ? Hostel.findById(student.currentHostel).select("paymentSettings") : null,
    ]);

    // Enrich each due with computed late fee (not saved — just informational)
    const enriched = dues.map((due) => {
      const dueObj = due.toObject({ virtuals: true });
      dueObj.computedFine = calculateLateFee(due, due.hostel || hostel);
      dueObj.totalPayable = due.amount + due.fineAmount + dueObj.computedFine - due.paidAmount;
      return dueObj;
    });

    res.json({
      dues: enriched,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    logger.error("Error fetching student dues: " + err.message);
    res.status(500).json({ error: "Failed to fetch dues" });
  }
};

/**
 * Create Razorpay order for a specific due (student)
 * @route POST /api/billing/dues/:id/create-order
 */
exports.createDueOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: dueId } = req.params;

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const due = await Due.findOne({ _id: dueId, student: student._id });
    if (!due) {
      return res.status(404).json({ error: "Due not found" });
    }

    if (due.status === "PAID" || due.status === "WAIVED" || due.status === "CANCELLED") {
      return res.status(400).json({ error: `Due is already ${due.status.toLowerCase()}` });
    }

    const hostel = await Hostel.findById(due.hostel).select("paymentSettings");
    const computedFine = calculateLateFee(due, hostel);
    const totalPayable = due.amount + due.fineAmount + computedFine - due.paidAmount;

    if (totalPayable <= 0) {
      return res.status(400).json({ error: "Nothing to pay on this due" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(totalPayable * 100), // paise
      currency: "INR",
      receipt: `due_${dueId}_${Date.now().toString().slice(-8)}`,
      notes: {
        studentId: student._id.toString(),
        dueId: dueId,
        hostelId: due.hostel.toString(),
      },
    });

    // Create a PENDING transaction immediately
    const transaction = new Transaction({
      student: student._id,
      hostel: due.hostel,
      owner: due.owner,
      due: due._id,
      amount: totalPayable,
      mode: "ONLINE",
      status: "PENDING",
      referenceId: order.id,
      gatewayDetails: { razorpayOrderId: order.id },
    });
    await transaction.save();

    logger.info(`Due order created: dueId=${dueId} orderId=${order.id} amount=${totalPayable}`);

    res.status(200).json({
      success: true,
      order: { id: order.id, amount: order.amount, currency: order.currency },
      key_id: process.env.RAZORPAY_KEY_ID,
      transactionId: transaction._id,
      studentDetails: { name: student.name, email: student.email, phone: student.phone },
    });
  } catch (err) {
    logger.error("Error creating due order: " + err.message);
    res.status(500).json({ error: "Failed to create payment order" });
  }
};

/**
 * Verify Razorpay payment for a due (idempotent — safe to retry)
 * @route POST /api/billing/dues/:id/verify
 */
exports.verifyDuePayment = async (req, res) => {
  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id;
    const { id: dueId } = req.params;

    const student = await Student.findOne({ user: userId });
    if (!student) {
      await dbSession.abortTransaction();
      return res.status(404).json({ error: "Student profile not found" });
    }

    // Idempotency: if this payment was already verified, return existing invoice
    const existingTxn = await Transaction.findOne({
      "gatewayDetails.razorpayPaymentId": razorpay_payment_id,
      status: "SUCCESS",
    }).populate("invoice");

    if (existingTxn) {
      await dbSession.abortTransaction();
      return res.status(200).json({
        success: true,
        message: "Payment already processed",
        invoice: existingTxn.invoice,
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await dbSession.abortTransaction();
      logger.warn(`Due payment signature mismatch: orderId=${razorpay_order_id}`);
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Find the pending transaction for this order
    const transaction = await Transaction.findOne({
      referenceId: razorpay_order_id,
      student: student._id,
    }).session(dbSession);

    if (!transaction) {
      await dbSession.abortTransaction();
      return res.status(404).json({ error: "Transaction not found. Create an order first." });
    }

    const due = await Due.findOne({ _id: dueId, student: student._id }).session(dbSession);
    if (!due) {
      await dbSession.abortTransaction();
      return res.status(404).json({ error: "Due not found" });
    }

    // Update transaction
    transaction.status = "SUCCESS";
    transaction.gatewayDetails.razorpayPaymentId = razorpay_payment_id;
    transaction.gatewayDetails.razorpaySignature = razorpay_signature;
    await transaction.save({ session: dbSession });

    // Update due paid amount + status
    const totalDue = due.amount + due.fineAmount;
    due.paidAmount = (due.paidAmount || 0) + transaction.amount;
    due.transactions.push(transaction._id);
    if (due.paidAmount >= totalDue) {
      due.status = "PAID";
    } else {
      due.status = "PARTIAL";
    }
    await due.save({ session: dbSession });

    // Generate invoice
    const invoice = new Invoice({
      transaction: transaction._id,
      student: student._id,
      hostel: due.hostel,
      invoiceNumber: generateInvoiceNumber(),
      amount: transaction.amount,
      items: [{ description: `${due.title} (Online)`, amount: transaction.amount }],
    });
    await invoice.save({ session: dbSession });

    transaction.invoice = invoice._id;
    await transaction.save({ session: dbSession });

    await dbSession.commitTransaction();

    logger.info(`Due payment verified: dueId=${dueId} invoiceId=${invoice._id} amount=${transaction.amount}`);

    res.status(200).json({
      success: true,
      message: "Payment successful",
      invoice: { id: invoice._id, invoiceNumber: invoice.invoiceNumber, amount: invoice.amount },
      due: { id: due._id, status: due.status, paidAmount: due.paidAmount },
    });
  } catch (err) {
    await dbSession.abortTransaction();
    logger.error("Error verifying due payment: " + err.message);
    res.status(500).json({ error: "Payment verification failed" });
  } finally {
    dbSession.endSession();
  }
};

/**
 * Get student's invoices (paginated)
 * @route GET /api/billing/my-invoices?page=1&limit=20
 */
exports.getMyInvoices = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const filter = { student: student._id };

    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .populate("hostel", "name")
        .populate("transaction", "mode status date")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Invoice.countDocuments(filter),
    ]);

    res.json({
      invoices,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    logger.error("Error fetching invoices: " + err.message);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

module.exports = exports;
