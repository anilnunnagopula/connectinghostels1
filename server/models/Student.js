const mongoose = require("mongoose");

/**
 * Student — Domain profile for a student tenant.
 *
 * Phase 1 changes:
 *   - REMOVED: name, email, phone — these duplicate User fields and get out
 *     of sync when a user updates their profile. Controllers now populate
 *     .populate("user", "name email phone") instead.
 *   - ADDED: currentRoom (ObjectId ref to Room) — replaces the raw `roomNumber: Number`
 *     which had zero referential integrity.
 *   - ADDED: activeBooking (ObjectId ref to Booking) — tracks the live contract.
 *   - MOVED: interestedHostels, recentlyViewed — moved here from User.js
 *     (they are student behavioural data, not auth identity data).
 *   - ADDED: checkInDate — was missing entirely.
 */
const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // ── Placement State ──────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["Searching", "Pending Approval", "Active", "Vacated"],
      default: "Searching",
      index: true,
    },
    currentHostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      default: null,
    },
    // THE FIX: real Room ObjectId reference instead of a raw Number
    currentRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
    // Keep roomNumber as a human-readable label for display (e.g. "101", "G2")
    // It is derived from Room.roomNumber — never trust this as the source of truth.
    roomNumber: {
      type: String,
      default: null,
    },
    currentOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    activeBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    checkInDate: {
      type: Date,
      default: null,
    },
    expectedCheckOutDate: {
      type: Date,
      default: null,
    },

    // ── Student Preferences ──────────────────────────────────────────────────
    // Moved from User — these are student behavioural data, not auth identity
    interestedHostels: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Hostel" }
    ],
    recentlyViewed: [
      {
        hostel:   { type: mongoose.Schema.Types.ObjectId, ref: "Hostel" },
        viewedAt: { type: Date, default: Date.now },
      }
    ],

    // ── Financial ────────────────────────────────────────────────────────────
    balance: { type: Number, default: 0 },

    // ── Soft Delete ──────────────────────────────────────────────────────────
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Compound indexes for owner's student list queries (hot path)
studentSchema.index({ currentOwner: 1, status: 1 });
studentSchema.index({ currentOwner: 1, createdAt: -1 });
studentSchema.index({ currentHostel: 1 });

// Soft-delete filter
studentSchema.pre(/^find/, function (next) {
  if (!Object.prototype.hasOwnProperty.call(this.getQuery(), "isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

module.exports = mongoose.model("Student", studentSchema);
