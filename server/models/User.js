const mongoose = require("mongoose");
const crypto = require("crypto");

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
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    profilePictureUrl: {
      type: String,
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

    // ==================== NEW: PASSWORD RESET FIELDS ====================
    resetPasswordToken: {
      type: String,
      select: false, // Don't return in queries
    },
    resetPasswordExpires: {
      type: Date,
      select: false, // Don't return in queries
    },

    // Track when password was last changed (for JWT invalidation)
    passwordChangedAt: {
      type: Date,
      select: false,
    },

    // Authentication provider tracking
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // Interested/Saved Hostels
    interestedHostels: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
    }],

    // Recently Viewed Hostels
    recentlyViewed: [{
      hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel"
      },
      viewedAt: {
        type: Date,
        default: Date.now
      }
    }],

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
  },
);

// ==================== EXISTING VIRTUALS & HOOKS ====================

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

// ==================== NEW: PASSWORD RESET METHODS ====================

/**
 * Generate a cryptographically secure password reset token
 * @returns {String} Unhashed reset token (to be sent via email)
 */
userSchema.methods.createPasswordResetToken = function () {
  // Generate random 32-byte token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token before storing in database (security best practice)
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiry time (10 minutes from now)
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Return the unhashed token (this will be sent via email)
  return resetToken;
};

/**
 * Check if password was changed after a JWT was issued
 * Used to invalidate old tokens after password reset
 * @param {Number} JWTTimestamp - The timestamp when JWT was issued
 * @returns {Boolean} True if password was changed after JWT
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  // Password was never changed
  return false;
};

/**
 * Check if user can reset password (not OAuth-only user)
 * @returns {Boolean} True if user can reset password
 */
userSchema.methods.canResetPassword = function () {
  // User can reset password if:
  // 1. They have a password set (not OAuth-only)
  // 2. OR they are a local provider user
  return !!(this.password || this.authProvider === "local");
};

module.exports = mongoose.model("User", userSchema);
