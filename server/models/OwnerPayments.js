/**
 * OwnerPayment Model
 * Stores payments received by hostel owners
 */

const mongoose = require("mongoose");

const ownerPaymentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
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
    paymentId: {
      type: String, // razorpay_payment_id
      required: true,
    },
    orderId: {
      type: String, // razorpay_order_id
      required: true,
    },
    status: {
      type: String,
      enum: ["success"],
      default: "success",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("OwnerPayment", ownerPaymentSchema);
