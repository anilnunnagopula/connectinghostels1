const mongoose = require("mongoose");

/**
 * OwnerProfile — Owner-specific domain state.
 *
 * Phase 1: Extracted from User.js. User.hostelName was a single string
 * that broke the moment an owner had multiple hostels. OwnerProfile holds
 * business identity, bank details, and verification status — none of which
 * belong on an auth record.
 */
const ownerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    gstin: {
      type: String,
      trim: true,
    },
    bankDetails: {
      accountName:   { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      ifscCode:      { type: String, trim: true },
      bankName:      { type: String, trim: true },
      upiId:         { type: String, trim: true },
    },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified"],
      default: "unverified",
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Soft-delete filter
ownerProfileSchema.pre(/^find/, function (next) {
  if (!Object.prototype.hasOwnProperty.call(this.getQuery(), "isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

module.exports = mongoose.model("OwnerProfile", ownerProfileSchema);
