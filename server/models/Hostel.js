const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
  {
    // ==================== PHASE 1 FIELDS ====================
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
      enum: ["Mangalpally", "Ibrahimpatnam", "Sheriguda", "Other"],
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["Boys", "Girls", "Co-ed"],
      required: true,
      index: true,
    },
    floors: {
      type: Number,
      min: 1,
      max: 50,
      default: 1,
    },
    // Floor metadata — each entry describes one floor and its room generation config
    floorConfig: [
      {
        floorNumber: { type: Number, required: true }, // 1, 2, 3 ...
        label: { type: String, default: "" },          // "Ground Floor", "1st Floor"
        prefix: { type: String, default: "" },         // "G", "1", "2" — used for room numbering
        roomCount: { type: Number, default: 0 },       // rooms on this floor (live count)
      },
    ],
    // ── DEPRECATED: Use hostel.stats instead (kept for migration safety) ──────
    // These will be removed once all code reads from hostel.stats.*
    totalRooms: {
      type: Number,
      required: true,
      min: 1,
    },
    availableRooms: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (v) {
          return v <= this.totalRooms;
        },
        message: "Available rooms cannot exceed total rooms",
      },
    },

    // ── Denormalized Stats (Phase 1) ─────────────────────────────────────────
    // Updated transactionally on every Room mutation (add/assign/vacate/delete).
    // Avoids N×countDocuments() on dashboard. Rebuilt nightly by a background job.
    stats: {
      totalRooms:    { type: Number, default: 0 },
      occupiedRooms: { type: Number, default: 0 },
      availableRooms:{ type: Number, default: 0 },
      lastCalculatedAt: { type: Date, default: null },
    },
    pricePerMonth: {
      type: Number,
      required: true,
      min: 0,
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    paymentSettings: {
      lateFeePolicy: {
        enabled: { type: Boolean, default: false },
        type: { type: String, enum: ["FIXED", "PERCENTAGE"], default: "FIXED" },
        value: { type: Number, default: 0 },
        gracePeriodDays: { type: Number, default: 5 },
      },
      bankDetails: {
        accountName: String,
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        upiId: String,
      },
      gatewayEnabled: { type: Boolean, default: true },
    },

    // ==================== PHASE 2+ FIELDS (Frozen) ====================
    // Uncomment when needed
    /*
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    rules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rule' }],
    bookingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BookingRequest' }],
    reviews: [{
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String,
      createdAt: Date
    }],
    verified: { type: Boolean, default: false }
    */
  },
  {
    timestamps: true,
  },
);

// Compound index for common queries (type + locality + active)
hostelSchema.index({ type: 1, locality: 1, isActive: 1 });

// Index for price range queries
hostelSchema.index({ pricePerMonth: 1 });

// Soft-delete filter: exclude deleted hostels from all find queries by default
hostelSchema.pre(/^find/, function (next) {
  if (!Object.prototype.hasOwnProperty.call(this.getQuery(), "isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

module.exports = mongoose.model("Hostel", hostelSchema);
