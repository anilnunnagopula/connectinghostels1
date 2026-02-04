const User = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/emailService");

// ==================== HELPER FUNCTION ====================

/**
 * Generate JWT token
 */
const generateToken = (userId, role = null) => {
  return jwt.sign(
    role ? { id: userId, role } : { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );
};

// ==================== GOOGLE OAUTH ====================

/**
 * Handle Google OAuth Login/Signup
 * Frontend sends Google access token, we fetch user info and create/login user
 */
exports.googleAuth = async (req, res) => {
  console.log("🔥 GOOGLE AUTH HIT");
  console.log("REQ BODY:", req.body);

  try {
    const { credential } = req.body; // Google access token from frontend

    if (!credential) {
      return res.status(400).json({ message: "Google credential required" });
    }

    // Fetch user info from Google using the access token
    const googleResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${credential}`,
        },
      },
    );

    const { sub: googleId, email, name, picture } = googleResponse.data;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Failed to get email from Google" });
    }

    // Check if user exists
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Existing user - login
      // Update googleId if it was an email/password account
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google"; // ✅ NEW: Mark as Google user
        await user.save();
      }
    } else {
      // New user - create account
      user = new User({
        googleId,
        email,
        name,
        authProvider: "google", // ✅ NEW: Mark as Google user
        profileCompleted: false, // Will be false until role & phone added
      });
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id, user.role || null);

    // Send response with user data
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
      message: user.profileCompleted
        ? "Login successful"
        : "Profile incomplete",
      token,
      user: userPayload,
      requiresProfileCompletion: !user.profileCompleted,
    });
  } catch (err) {
    console.error("🚨 GOOGLE AUTH FULL ERROR ↓↓↓");
    console.error(err);
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

    // Generate new token with role
    const token = generateToken(user._id, user.role);

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
      token,
      user: userPayload,
    });
  } catch (err) {
    console.error("🚨 Profile Completion Error:", err);
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

    // Generate token
    const token = generateToken(user._id, user.role);

    // User payload
    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      hostelName: user.hostelName,
      profileCompleted: user.profileCompleted,
    };

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: userPayload,
    });
  } catch (err) {
    console.error("🚨 Register Error:", err);
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
      return res.status(404).json({ message: "User not found" });
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
      return res.status(401).json({ message: "Invalid password" });
    }

    // Optional: Verify role matches if provided
    if (role && user.role !== role) {
      return res
        .status(403)
        .json({ message: `This account is registered as ${user.role}` });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // User payload
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
      token,
      user: userPayload,
    });
  } catch (err) {
    console.error("🚨 Login Error:", err);
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

    // Send email (you'll need to create the email service)
    try {
      await sendPasswordResetEmail(user, resetToken);

      // For development: also log to console
      if (process.env.NODE_ENV === "development") {
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        console.log("🔗 PASSWORD RESET URL:", resetURL);
      }

      res.status(200).json({
        message: "Password reset link has been sent to your email",
      });
    } catch (emailError) {
      // If email fails, clear the reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.error("❌ Email sending failed:", emailError);

      return res.status(500).json({
        message: "Failed to send reset email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
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

    console.log("✅ Password reset successful for:", user.email);

    res.status(200).json({
      message:
        "Password has been reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
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
    console.error("❌ Verify token error:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
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
    console.error("Error fetching profile:", err);
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
    console.error("Error updating profile:", err);
    
    // Handle duplicate key errors (e.g. username taken)
    if (err.code === 11000) {
        if (err.keyPattern.username) {
            return res.status(400).json({ message: "Username already taken" });
        }
    }
    
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/**
 * Logout (client-side token removal)
 * Just for consistency - actual logout happens on frontend
 */
exports.logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};
