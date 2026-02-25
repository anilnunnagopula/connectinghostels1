const mongoose = require("mongoose");

/**
 * BookingRequest — A student's intent to book a specific room.
 *
 * Phase 1 changes:
 *   - CHANGED: roomNumber (Number) + floor (Number) → room (ObjectId ref to Room)
 *     The old fields stored phantom integers with no FK integrity. A student
 *     could request room "5" on floor "2" that doesn't exist as a Room document.
 *   - ADDED: expiresAt — pending requests now auto-expire (7 days).
 *     Without this, a student who forgets about a request is permanently stuck
 *     in "Pending Approval" with no way out except manual intervention.
 *   - ADDED: status 'cancelled' — distinct from 'Rejected' (owner action);
 *     'cancelled' is a student action.
 *
 * Note: floor and roomNumber are kept as optional legacy fields to support
 * the existing createBookingRequest flow while room assignment is being migrated.
 * Remove them once all rooms have Room documents.
 */
const bookingRequestSchema = new mongoose.Schema(
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
      ref: "User",
      required: true,
      index: true,
    },

    // THE FIX: real Room reference instead of raw Number fields
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null, // null during migration period while Room docs are being created
    },

    // Legacy fields — kept for backward compat during migration, remove after Phase 1 migration completes
    floor: {
      type: Number,
      min: 1,
    },
    roomNumber: {
      type: Number,
      min: 1,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
      index: true,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    // 7 days from creation — a BullMQ job cleans up expired pending requests
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

// Prevents duplicate pending requests for the same hostel
bookingRequestSchema.index(
  { student: 1, hostel: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "Pending" },
    name: "unique_pending_request_per_hostel",
  }
);

// Owner's pending queue — most-used index for the owner dashboard
bookingRequestSchema.index({ owner: 1, status: 1 });
bookingRequestSchema.index({ student: 1, status: 1 });

module.exports = mongoose.model("BookingRequest", bookingRequestSchema);
