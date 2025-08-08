const mongoose = require("mongoose");

const payoutMethodSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["BANK_TRANSFER", "UPI"],
      required: true,
    },
    details: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolderName: String,
      upiId: String,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PayoutMethod", payoutMethodSchema);
