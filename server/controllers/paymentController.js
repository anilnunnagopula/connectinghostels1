// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const mongoose = require("mongoose");
// const Payment = require("../models/Payment"); // Legacy support if needed, or remove
// const Transaction = require("../models/Transaction");
// const Due = require("../models/Due");
// const Invoice = require("../models/Invoice");
// const Student = require("../models/Student");
// const Hostel = require("../models/Hostel");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Helper: Get student details from request (assuming auth middleware sets req.user)
// // But for some routes we might need to fetch fresh specific data.

// /**
//  * @desc    Get all dues for the logged-in student
//  * @route   GET /api/payment/dues
//  * @access  Student
//  */
// exports.getStudentDues = async (req, res) => {
//   try {
//     const studentId = req.user.id;
    
//     // Auto-generate rent if needed (This would usually be a cron job, but for MVP we fetch existing)
//     // For now, just return what's in DB.
    
//     const dues = await Due.find({ student: studentId })
//         .sort({ dueDate: 1 }) // Earliest due first
//         .populate("hostel", "name");

//     res.status(200).json({ dues });
//   } catch (err) {
//     console.error("Error fetching dues:", err);
//     res.status(500).json({ message: "Failed to fetch dues." });
//   }
// };

// /**
//  * @desc    Get payment history (Transactions)
//  * @route   GET /api/payment/history
//  * @access  Student
//  */
// exports.getStudentPaymentHistory = async (req, res) => {
//   try {
//     const studentId = req.user.id;
//     const history = await Transaction.find({ 
//         student: studentId, 
//         status: { $in: ["SUCCESS", "VERIFICATION_PENDING"] } 
//     })
//     .sort({ date: -1 })
//     .populate("due", "title type");

//     res.status(200).json({ history });
//   } catch (err) {
//     console.error("Error fetching payment history:", err);
//     res.status(500).json({ message: "Failed to fetch history." });
//   }
// };

// /**
//  * @desc    Initiate Razorpay Order for a specific Due or Advance
//  * @route   POST /api/payment/create-order
//  * @access  Student
//  */
// exports.createRazorpayOrder = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { amount, dueId } = req.body; // amount in INR
//     const studentId = req.user.id;

//     const student = await Student.findById(studentId);
//     if (!student) throw new Error("Student not found");

//     // Create Razorpay Order
//     // Amount must be in paise
//     const options = {
//       amount: Math.round(amount * 100), 
//       currency: "INR",
//       receipt: `rcpt_${Date.now().toString().slice(-8)}`,
//       payment_capture: 1,
//     };

//     const order = await razorpay.orders.create(options);

//     // Create a PENDING Transaction record
//     const newTransaction = new Transaction({
//         student: studentId,
//         hostel: student.hostel,
//         owner: student.owner,
//         due: dueId || null,
//         amount: amount,
//         mode: "ONLINE",
//         status: "PENDING",
//         referenceId: order.id,
//         gatewayDetails: {
//             razorpayOrderId: order.id
//         }
//     });

//     await newTransaction.save({ session });

//     await session.commitTransaction();
    
//     res.status(200).json({
//       order,
//       key: process.env.RAZORPAY_KEY_ID,
//       studentDetails: {
//         name: student.name,
//         email: student.email,
//         phone: student.phone,
//       },
//     });
//   } catch (err) {
//     await session.abortTransaction();
//     console.error("Error creating order:", err);
//     res.status(500).json({ message: "Failed to create payment order." });
//   } finally {
//     session.endSession();
//   }
// };

// /**
//  * @desc    Verify Razorpay Payment Signature
//  * @route   POST /api/payment/verify
//  * @access  Student
//  */
// exports.verifyPayment = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     // Verify Signature
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//         // Mark transaction as failed?
//         await Transaction.findOneAndUpdate(
//             { referenceId: razorpay_order_id },
//             { status: "FAILED", remarks: "Signature mismatch" }
//         );
//         return res.status(400).json({ message: "Invalid signature" });
//     }

//     // 1. Find Transaction
//     const transaction = await Transaction.findOne({ referenceId: razorpay_order_id }).session(session);
//     if (!transaction) return res.status(404).json({ message: "Transaction not found" });

//     if (transaction.status === "SUCCESS") {
//         return res.status(200).json({ message: "Payment already processed" });
//     }

//     // 2. Update Transaction
//     transaction.status = "SUCCESS";
//     transaction.gatewayDetails.razorpayPaymentId = razorpay_payment_id;
//     transaction.gatewayDetails.razorpaySignature = razorpay_signature;
//     await transaction.save({ session });

//     // 3. Update Due (if linked)
//     if (transaction.due) {
//         const due = await Due.findById(transaction.due).session(session);
//         if (due) {
//             due.paidAmount = (due.paidAmount || 0) + transaction.amount;
//             // Check if fully paid
//             if (due.paidAmount >= (due.amount + due.fineAmount)) {
//                 due.status = "PAID";
//             } else {
//                 due.status = "PARTIAL";
//             }
//             due.transactions.push(transaction._id);
//             await due.save({ session });
//         }
//     }

//     // 4. Update Student Balance (Optional, if using wallet model)
//     // await Student.findByIdAndUpdate(transaction.student, { $inc: { balance: transaction.amount } });

//     // 5. Generate Invoice
//     const invoice = new Invoice({
//         transaction: transaction._id,
//         student: transaction.student,
//         hostel: transaction.hostel,
//         invoiceNumber: `INV-${Date.now()}`,
//         amount: transaction.amount,
//         items: [{
//             description: transaction.due ? "Payment for Due" : "Ad-hoc Payment",
//             amount: transaction.amount
//         }]
//     });
//     await invoice.save({ session });
    
//     // Link invoice to transaction
//     transaction.invoice = invoice._id;
//     await transaction.save({ session });

//     await session.commitTransaction();

//     res.status(200).json({ message: "Payment successful", invoiceId: invoice._id });

//   } catch (err) {
//     await session.abortTransaction();
//     console.error("Error verifying payment:", err);
//     res.status(500).json({ message: "Payment verification failed." });
//   } finally {
//     session.endSession();
//   }
// };

// /**
//  * @desc    Record Cash Payment (Owner Only)
//  * @route   POST /api/payment/record-cash
//  * @access  Owner
//  */
// exports.recordCashPayment = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         const { studentId, dueId, amount, remarks } = req.body;
//         const ownerId = req.user.id;

//         const student = await Student.findById(studentId);
//         if(!student) return res.status(404).json({ message: "Student not found" });

//         // Create Transaction
//         const transaction = new Transaction({
//             student: studentId,
//             hostel: student.hostel,
//             owner: ownerId,
//             due: dueId || null,
//             amount: amount,
//             mode: "CASH",
//             status: "SUCCESS", // Cash is instant success
//             verifiedBy: ownerId,
//             remarks: remarks || "Cash payment recorded by owner",
//             date: new Date()
//         });
//         await transaction.save({ session });

//         // Update Due
//         if(dueId) {
//             const due = await Due.findById(dueId).session(session);
//             if(due) {
//                 due.paidAmount = (due.paidAmount || 0) + Number(amount);
//                  if (due.paidAmount >= (due.amount + due.fineAmount)) {
//                     due.status = "PAID";
//                 } else {
//                     due.status = "PARTIAL";
//                 }
//                 due.transactions.push(transaction._id);
//                 await due.save({ session });
//             }
//         }

//         // Generate Receipt/Invoice
//         const invoice = new Invoice({
//             transaction: transaction._id,
//             student: studentId,
//             hostel: student.hostel,
//             invoiceNumber: `RCPT-CASH-${Date.now()}`,
//             amount: amount,
//             items: [{ description: "Cash Payment", amount: Number(amount) }]
//         });
//         await invoice.save({ session });
        
//         transaction.invoice = invoice._id;
//         await transaction.save({ session });

//         await session.commitTransaction();
//         res.status(200).json({ message: "Cash payment recorded successfully", transaction });

//     } catch (err) {
//         await session.abortTransaction();
//         console.error("Error recording cash payment:", err);
//         res.status(500).json({ message: "Failed to record payment" });
//     } finally {
//         session.endSession();
//     }
// };

// /**
//  * @desc    Create a new Due (Owner Only)
//  * @route   POST /api/payment/create-due
//  * @access  Owner
//  */
// exports.createDue = async (req, res) => {
//     try {
//         const { studentId, title, type, amount, dueDate, remarks } = req.body;
//         // Validation handled by mongoose mostly, but basic checks:
//         if (!studentId || !amount) {
//             return res.status(400).json({ message: "Student ID and Amount are required" });
//         }

//         const student = await Student.findById(studentId);
//         if (!student) return res.status(404).json({ message: "Student not found" });

//         const newDue = new Due({
//             student: studentId,
//             hostel: student.hostel,
//             title,
//             type,
//             amount,
//             dueDate: dueDate || new Date(), // Default to today if not provided? Or maybe logic required.
//             remarks
//         });
        
//         await newDue.save();
//         res.status(201).json({ message: "Due created successfully", due: newDue });

//     } catch (err) {
//         console.error("Error creating due:", err);
//         res.status(500).json({ message: "Failed to create due" });
//     }
// };
