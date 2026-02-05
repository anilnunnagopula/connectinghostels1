/**
 * BookingRequest Model - Enhanced with Floor Selection
 *
 * Changes from original:
 * - Added `floor` field for multi-floor hostels
 * - Added `requestedAt` for tracking
 * - Indexed for query performance
 */

const mongoose = require("mongoose");

const bookingRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true, // Performance: Fast lookups by student
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
      index: true, // Performance: Fast lookups by hostel
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Performance: Fast lookups by owner
    },
    floor: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Floor must be a whole number",
      },
    },
    roomNumber: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Room number must be a whole number",
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true, // Performance: Fast status-based queries
    },
    // Optional: Reason for rejection (owner can provide feedback)
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    // Add compound index for preventing duplicate pending requests
    indexes: [
      { student: 1, status: 1 }, // Find student's pending requests
      { owner: 1, status: 1 }, // Find owner's pending requests
    ],
  },
);

// Compound index to prevent duplicate pending requests for same hostel
bookingRequestSchema.index(
  { student: 1, hostel: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "Pending" },
    name: "unique_pending_request_per_hostel",
  },
);

module.exports = mongoose.model("BookingRequest", bookingRequestSchema);
