const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
      index: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // Optional because a transaction might cover multiple dues or be an advance
    due: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Due",
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
        type: String,
        default: "INR"
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    mode: {
      type: String,
      enum: ["ONLINE", "CASH", "UPI_QR", "BANK_TRANSFER"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "RFUNDED", "VERIFICATION_PENDING"],
      default: "PENDING",
      index: true,
    },
    // For specific payment gateway details
    referenceId: {
      type: String, // Razorpay Order ID or internal receipt ID
      index: true,
    },
    gatewayDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      error_code: String,
      error_description: String
    },
    // For manual payments (Cash/Bank Transfer)
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The owner/admin who marked it as received
    },
    remarks: String,
    
    // Invoice reference
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
