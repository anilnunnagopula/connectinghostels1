const mongoose = require("mongoose");
const crypto = require("crypto");

/**
 * User — Auth identity only.
 *
 * Phase 1 cleanup: removed owner-specific (hostelName) and student-specific
 * (interestedHostels, recentlyViewed) fields. Those now live in OwnerProfile
 * and Student respectively, keeping User as a pure auth record.
 */
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
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
    profilePictureUrl: String,
    role: {
      type: String,
      enum: ["student", "owner", "admin"],
      index: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
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
  this.profileCompleted = !!(this.role && this.phone && this.name);
  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.canResetPassword = function () {
  return !!(this.password || this.authProvider === "local");
};

module.exports = mongoose.model("User", userSchema);
