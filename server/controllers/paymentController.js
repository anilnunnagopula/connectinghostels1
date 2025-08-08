const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const OwnerPayment = require("../models/OwnerPayments"); // ✅ ADDED: OwnerPayment model

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.getStudentBill = async (req, res) => {
  try {
    const studentId = req.user.id; // Assuming student ID is from auth token
    const student = await Student.findById(studentId).populate("hostel");

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // This is a placeholder for your bill generation logic.
    // In a real app, you would check for a pending bill.
    const bill = {
      _id: "bill_id_123", // Example bill ID
      hostelName: student.hostel.name,
      month: "August 2025",
      dueDate: "August 25, 2025",
      amount: 500000, // Amount in paise (e.g., 5000.00)
      status: "Pending",
    };

    res.status(200).json({ bill });
  } catch (err) {
    console.error("Error fetching student bill:", err);
    res.status(500).json({ message: "Failed to fetch bill." });
  }
};
exports.getPayoutMethods = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const settings = await OwnerPayment.findOne({ owner: ownerId });

    if (!settings) {
      // If no settings are found, return an empty array, which the frontend can handle
      return res.status(200).json([]);
    }

    const methods = [];
    if (settings.bankDetails && settings.bankDetails.accountNumber) {
      methods.push({
        _id: settings._id, // Using the owner payment doc ID
        type: "BANK_TRANSFER",
        isDefault: true, // Assuming the first one is default for simplicity
        details: settings.bankDetails,
      });
    }

    if (settings.upiId) {
      // Assuming UPI is a separate method
      methods.push({
        _id: settings._id, // Using the same doc ID for now
        type: "UPI",
        isDefault: false,
        details: { upiId: settings.upiId },
      });
    }

    res.status(200).json(methods);
  } catch (err) {
    console.error("Error fetching payout methods:", err);
    res.status(500).json({ message: "Failed to fetch payout methods." });
  }
};
exports.getStudentPaymentHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    const history = await Payment.find({ student: studentId }).sort({
      paidAt: -1,
    });

    res.status(200).json({ history });
  } catch (err) {
    console.error("Error fetching payment history:", err);
    res.status(500).json({ message: "Failed to fetch history." });
  }
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, receiptId } = req.body;
    const studentId = req.user.id;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const orderOptions = {
      amount,
      currency: "INR",
      receipt: receiptId,
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(orderOptions);

    res.status(200).json({
      order,
      studentDetails: {
        name: student.name,
        email: student.email,
        phone: student.phone,
      },
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ message: "Failed to create order." });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const studentId = req.user.id;
    const student = await Student.findById(studentId);

    // Generate signature to verify against the one received from Razorpay
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed." });
    }

    // ✅ FIXED: Get payment details from order
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const amountInRupees = order.amount / 100;
    const newPayment = new Payment({
      student: studentId,
      hostel: student.hostel,
      owner: student.owner,
      amount: amountInRupees,
      status: "Success",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });
    await newPayment.save();

    res.status(200).json({ message: "Payment verified successfully." });
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ message: "Failed to verify payment." });
  }
};
