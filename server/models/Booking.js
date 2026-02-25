const mongoose = require("mongoose");

/**
 * Booking — The active tenancy contract.
 *
 * Phase 1: Previously missing. BookingRequest captured *intent*, but approval
 * just mutated Student state with no paper trail. Without a Booking document:
 *   - Billing can't reference a contract start date/rent snapshot
 *   - Revenue analytics have no source of truth
 *   - Checkout history is impossible to reconstruct
 *
 * Booking is created atomically inside BookingService.approve(). It is
 * append-only — never deleted, only status-transitioned.
 */
const bookingSchema = new mongoose.Schema(
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
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bookingRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookingRequest",
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null, // null = indefinite (month-to-month)
    },
    // Snapshot of rent at booking time — never recalculate from Hostel.pricePerMonth
    // (price may change; historical billings must use the agreed amount)
    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "completed", "terminated"],
      default: "active",
      index: true,
    },
    terminatedAt: {
      type: Date,
      default: null,
    },
    terminationReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound indexes for hot query paths
bookingSchema.index({ student: 1, status: 1 });
bookingSchema.index({ hostel: 1, status: 1 });
bookingSchema.index({ owner: 1, status: 1 });

// Prevents double-booking: only one active booking per room at a time
// Partial index = only enforced when status is 'active'
bookingSchema.index(
  { room: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "active" },
    name: "unique_active_booking_per_room",
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
