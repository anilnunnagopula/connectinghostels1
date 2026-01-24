const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==================== PHASE 1 FIELDS (OAuth-First) ====================
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values for non-OAuth users
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["student", "owner"],
      index: true, // Fast role-based queries
    },
    phone: {
      type: String,
      trim: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // Owner-specific fields
    hostelName: {
      type: String,
      trim: true,
    },

    // Optional: Email/password fallback (Phase 2)
    password: {
      type: String,
      select: false, // Don't return password in queries by default
    },

    // ==================== PHASE 2+ FIELDS (Frozen) ====================
    // Uncomment when needed
    /*
    avatar: String,
    verified: { type: Boolean, default: false },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BookingRequest' }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
    complaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }]
    */
  },
  {
    timestamps: true,
  }
);

// Virtual field to check if profile is complete
userSchema.virtual("isProfileComplete").get(function () {
  return !!(this.role && this.phone && this.name);
});

// Pre-save hook to auto-update profileCompleted flag
userSchema.pre("save", function (next) {
  if (this.role && this.phone && this.name) {
    this.profileCompleted = true;
  } else {
    this.profileCompleted = false;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
