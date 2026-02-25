const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Student = require("../models/Student");
const logger = require("../middleware/logger");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============================================================================
// CREATE ORDER
// ============================================================================

/**
 * Create Razorpay Order
 * @route POST /api/payments/create-order
 */
exports.createOrder = async (req, res) => {
  try {
    const { amount, hostelId } = req.body;
    const userId = req.user.id;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        studentId: student._id.toString(),
        hostelId: hostelId || "",
        description: "Hostel Fee Payment",
      },
    };

    const order = await razorpay.orders.create(options);

    logger.info(`Razorpay order created: orderId=${order.id} studentId=${student._id}`);

    res.status(200).json({
      success: true,
      order: { id: order.id, amount: order.amount, currency: order.currency },
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    logger.error("Error creating Razorpay order: " + err.message);
    res.status(500).json({ error: "Failed to create payment order" });
  }
};

// ============================================================================
// VERIFY PAYMENT
// ============================================================================

/**
 * Verify Payment Signature
 * @route POST /api/payments/verify
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, hostelId } =
      req.body;
    const userId = req.user.id;

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    // Idempotency: if already verified, return existing record
    const existing = await Payment.findOne({ razorpay_payment_id });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Payment already processed",
        payment: { id: existing._id, amount: existing.amount, status: existing.status },
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      logger.warn(`Payment signature mismatch: orderId=${razorpay_order_id}`);
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    const payment = new Payment({
      student: student._id,
      hostel: hostelId,
      amount: amount / 100,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: "success",
    });

    await payment.save();

    logger.info(`Payment verified: paymentId=${payment._id} studentId=${student._id}`);

    // Emit payment:confirmed to the student in real-time (non-blocking)
    try {
      req.app?.locals?.io
        ?.to(`user:${userId}`)
        .emit("payment:confirmed", {
          paymentId: payment._id,
          amount: payment.amount,
          status: "success",
        });
    } catch (emitErr) {
      logger.warn("Failed to emit payment:confirmed: " + emitErr.message);
    }

    res.status(200).json({
      success: true,
      message: "Payment successful",
      payment: { id: payment._id, amount: payment.amount, status: payment.status },
    });
  } catch (err) {
    logger.error("Error verifying payment: " + err.message);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

// ============================================================================
// GET PAYMENT HISTORY (paginated)
// ============================================================================

/**
 * Get student's payment history
 * @route GET /api/payments/my-payments?page=1&limit=20
 */
exports.getMyPayments = async (req, res) => {
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

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate("hostel", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Payment.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      payments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    logger.error("Error fetching payment history: " + err.message);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
};

// ============================================================================
// RAZORPAY WEBHOOK
// ============================================================================

/**
 * Handle Razorpay webhook events
 * Signature is verified using RAZORPAY_WEBHOOK_SECRET (not the API key secret).
 * The raw request body (saved to req.rawBody in index.js) is used for verification.
 *
 * @route POST /api/payments/webhook
 */
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      logger.warn("RAZORPAY_WEBHOOK_SECRET not configured — skipping webhook verification");
      return res.status(200).json({ status: "ok" });
    }

    const signature = req.headers["x-razorpay-signature"];
    if (!signature) {
      return res.status(400).json({ error: "Missing webhook signature" });
    }

    // Verify signature using raw body
    const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      logger.warn("Razorpay webhook signature verification failed");
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    const event = req.body;
    const eventType = event.event;

    logger.info(`Razorpay webhook received: event=${eventType}`);

    if (eventType === "payment.captured") {
      const paymentEntity = event.payload?.payment?.entity;
      if (paymentEntity) {
        await Payment.findOneAndUpdate(
          { razorpay_payment_id: paymentEntity.id },
          { status: "success" },
        );
        logger.info(`Webhook: payment captured for paymentId=${paymentEntity.id}`);
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = event.payload?.payment?.entity;
      if (paymentEntity) {
        await Payment.findOneAndUpdate(
          { razorpay_order_id: paymentEntity.order_id },
          { status: "failed" },
        );
        logger.info(`Webhook: payment failed for orderId=${paymentEntity.order_id}`);
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (err) {
    logger.error("Error processing Razorpay webhook: " + err.message);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

module.exports = exports;
