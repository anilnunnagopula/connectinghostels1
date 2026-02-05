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
      enum: ["Boys", "Girls", "Co-Live"],
      required: true,
      index: true,
    },
    floors: {
      // ✅ ADD THIS
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
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

module.exports = mongoose.model("Hostel", hostelSchema);
