const User = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/emailService");
const { addEmailJob } = require("../queues/emailQueue");
const logger = require("../middleware/logger");

// ==================== HELPERS ====================

const generateToken = (userId, role = null) => {
  return jwt.sign(
    role ? { id: userId, role } : { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );
};

/**
 * Set JWT as httpOnly cookie on the response.
 *
 * SameSite=None + Secure is required in production because the frontend
 * (Netlify) and backend are on different domains. Without None, the browser
 * will not send the cookie on cross-site XHR/fetch requests.
 * CSRF risk from None is mitigated by strict CORS + JSON content-type checks.
 *
 * In development both run on localhost so Lax is sufficient.
 */
const setAuthCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,             // HTTPS only in production
    sameSite: isProd ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  });
};

// ==================== GOOGLE OAUTH ====================

/**
 * Handle Google OAuth Login/Signup
 * Frontend sends Google access token, we fetch user info and create/login user
 */
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential required" });
    }

    const googleResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${credential}` } },
    );

    const { sub: googleId, email, name } = googleResponse.data;

    if (!email) {
      return res.status(400).json({ message: "Failed to get email from Google" });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        await user.save();
      }
    } else {
      user = new User({
        googleId,
        email,
        name,
        authProvider: "google",
        profileCompleted: false,
      });
      await user.save();
    }

    const token = generateToken(user._id, user.role || null);
    setAuthCookie(res, token);

    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      hostelName: user.hostelName,
      profileCompleted: user.profileCompleted,
    };

    res.status(200).json({
      message: user.profileCompleted ? "Login successful" : "Profile incomplete",
      user: userPayload,
      requiresProfileCompletion: !user.profileCompleted,
    });
  } catch (err) {
    logger.error("Google auth error: " + err.message);
    res.status(500).json({
      message: "Google authentication failed",
      error: err.response?.data?.error || err.message,
    });
  }
};

/**
 * Complete user profile after OAuth
 * Called when user needs to add role, phone, etc.
 */
exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user._id; // From requireAuth middleware
    const { role, phone, hostelName } = req.body;

    if (!role || !phone) {
      return res.status(400).json({
        message: "Role and phone number are required",
      });
    }

    if (role === "owner" && !hostelName) {
      return res.status(400).json({
        message: "Hostel name is required for owners",
      });
    }

    // Update user profile
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    user.phone = phone;
    if (role === "owner") {
      user.hostelName = hostelName;
    }
    // profileCompleted will be auto-set to true by pre-save hook
    await user.save();

    const token = generateToken(user._id, user.role);
    setAuthCookie(res, token);

    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      hostelName: user.hostelName,
      profileCompleted: user.profileCompleted,
    };

    res.status(200).json({
      message: "Profile completed successfully",
      user: userPayload,
    });
  } catch (err) {
    logger.error("Profile completion error: " + err.message);
    res.status(500).json({ message: "Failed to complete profile" });
  }
};

// ==================== EMAIL/PASSWORD AUTH ====================

/**
 * Register with Email/Password
 */
exports.registerWithEmail = async (req, res) => {
  try {
    let { name, email, phone, phoneNumber, password, role, hostelName } = req.body;

    // Handle phone number alias
    if (!phone && phoneNumber) {
        phone = phoneNumber;
    }

    // Validation
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (role === "owner" && !hostelName) {
      return res
        .status(400)
        .json({ message: "Hostel name is required for owners" });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      // Check if this was a pre-created account (by an owner adding a walk-in student)
      // These accounts have no password set by the student themselves
      // Signal to frontend to show "your owner enrolled you" message
      const Student = require("../models/Student");
      const studentProfile = await Student.findOne({ user: existing._id });
      if (studentProfile && studentProfile.currentOwner) {
        return res.status(409).json({
          message: "An account was already created for you by your hostel owner. Please login or reset your password to access your profile.",
          ownerCreated: true,
        });
      }
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      hostelName: role === "owner" ? hostelName : undefined,
      authProvider: "local", // ✅ NEW: Mark as local user
      profileCompleted: true, // Email/password users complete profile during registration
    });

    await user.save();

    const token = generateToken(user._id, user.role);
    setAuthCookie(res, token);

    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      hostelName: user.hostelName,
      profileCompleted: user.profileCompleted,
    };

    // Enqueue welcome email (non-blocking)
    try {
      const { addEmailJob } = require("../queues/emailQueue");
      if (addEmailJob) {
        await addEmailJob("welcome", { user: { name: user.name, email: user.email, role: user.role } });
      }
    } catch (emailErr) {
      logger.warn("Failed to enqueue welcome email: " + emailErr.message);
    }

    res.status(201).json({
      message: "Registered successfully",
      user: userPayload,
    });
  } catch (err) {
    logger.error("Register error: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Login with Email/Password
 */
exports.loginWithEmail = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({
        message:
          "This account uses Google Sign-In. Please sign in with Google.",
      });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Optional: Verify role matches if provided
    if (role && user.role !== role) {
      return res
        .status(403)
        .json({ message: `This account is registered as ${user.role}` });
    }

    const token = generateToken(user._id, user.role);
    setAuthCookie(res, token);

    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      hostelName: user.hostelName,
      profileCompleted: user.profileCompleted,
    };

    res.status(200).json({
      message: "Login successful",
      user: userPayload,
    });
  } catch (err) {
    logger.error("Login error: " + err.message);
    res.status(500).json({ message: "Login failed" });
  }
};

// ==================== 🆕 PASSWORD RESET ====================

/**
 * Forgot Password - Send reset email
 * POST /api/auth/forgot-password
 * Public route
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        message: "Please provide an email address",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // ⚠️ SECURITY: Always return success to prevent email enumeration
    // Don't reveal if email exists or not
    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, you will receive a password reset link",
      });
    }

    // Check if user is OAuth-only user (Google without password)
    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        message: "This account uses Google Sign-In. Please log in with Google.",
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();

    // Save token to database (skip validation)
    await user.save({ validateBeforeSave: false });

    // Send password reset email — async via queue if Redis is configured,
    // otherwise synchronous (blocks until SMTP responds)
    try {
      if (process.env.NODE_ENV === "development") {
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        logger.debug("Password reset URL: " + resetURL);
      }

      if (addEmailJob) {
        // Non-blocking: queued via BullMQ — retried automatically on failure
        await addEmailJob("password-reset", {
          user: { email: user.email, name: user.name },
          token: resetToken,
        });
      } else {
        // Synchronous fallback when Redis is not configured
        await sendPasswordResetEmail(user, resetToken);
      }

      res.status(200).json({
        message: "Password reset link has been sent to your email",
      });
    } catch (emailError) {
      // If synchronous email fails, clear the reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      logger.error("Email sending failed: " + emailError.message);
      return res.status(500).json({
        message: "Failed to send reset email. Please try again later.",
      });
    }
  } catch (error) {
    logger.error("Forgot password error: " + error.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

/**
 * Reset Password
 * POST /api/auth/reset-password/:token
 * Public route
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Validate inputs
    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Please provide password and confirm password",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash the token from URL to compare with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token and not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordChangedAt = Date.now() - 1000; // Subtract 1s for JWT timing
    user.authProvider = "local"; // Ensure they're marked as local user now

    await user.save();

    // Optional: Send confirmation email
    // await sendPasswordChangedEmail(user);

    logger.info("Password reset successful for: " + user.email);

    res.status(200).json({
      message: "Password has been reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    logger.error("Reset password error: " + error.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

/**
 * Verify Reset Token (Optional - for frontend validation)
 * GET /api/auth/verify-reset-token/:token
 * Public route
 */
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    res.status(200).json({
      message: "Valid token",
      email: user.email, // Optional: show email on reset page
    });
  } catch (error) {
    logger.error("Verify token error: " + error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ==================== PROFILE MANAGEMENT ====================

/**
 * Get current user profile
 * Requires authentication
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert to object and map phone -> phoneNumber for frontend consistency
    const userObj = user.toObject();
    userObj.phoneNumber = user.phone;

    res.status(200).json(userObj);
  } catch (err) {
    logger.error("Get profile error: " + err.message);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/**
 * Update user profile
 * Requires authentication
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      phone,
      phoneNumber,
      hostelName,
      username,
      profilePictureUrl,
      currentPassword,
      newPassword,
    } = req.body;

    // Find user and include password for verification if needed
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic fields
    if (name) user.name = name;
    
    // Handle phone number (support both 'phone' and 'phoneNumber' from frontend)
    if (phone) user.phone = phone;
    if (phoneNumber) user.phone = phoneNumber;

    if (username) user.username = username;
    if (profilePictureUrl) user.profilePictureUrl = profilePictureUrl;

    if (hostelName && user.role === "owner") {
      user.hostelName = hostelName;
    }

    // Handle password update
    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required to change password" });
      }

      // If user has a password set (local auth), verify it
      if (user.password) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Incorrect current password" });
        }
      }

      // Hash and set new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.passwordChangedAt = Date.now() - 1000;
    }

    // Save changes
    await user.save();

    // Return updated user without sensitive fields
    const updatedUser = await User.findById(userId).select("-password -resetPasswordToken -resetPasswordExpires");

    // Convert to object and map phone -> phoneNumber for frontend consistency
    const userObj = updatedUser.toObject();
    userObj.phoneNumber = updatedUser.phone;

    res.status(200).json(userObj);
  } catch (err) {
    logger.error("Update profile error: " + err.message);
    if (err.code === 11000 && err.keyPattern?.username) {
      return res.status(400).json({ message: "Username already taken" });
    }
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/**
 * Logout — clears the httpOnly auth cookie server-side.
 */
exports.logout = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
