const mongoose = require("mongoose");

const ownerPaymentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each owner should have only one payment settings document
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      beneficiaryName: String,
      bankName: String,
    },
    upiId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("OwnerPayment", ownerPaymentSchema);
