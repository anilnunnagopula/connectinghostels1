/**
 * Payment Model - SIMPLE VERSION
 * Just stores successful student payments
 */

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    // Razorpay IDs
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
    // Optional: What is this payment for?
    description: {
      type: String,
      default: "Hostel Fee Payment",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
