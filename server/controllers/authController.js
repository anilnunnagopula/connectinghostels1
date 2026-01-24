const User = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const bcrypt = require("bcryptjs");

// ==================== HELPER FUNCTION ====================

/**
 * Generate JWT token
 */
const generateToken = (userId, role = null) => {
  return jwt.sign(
    role ? { id: userId, role } : { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
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
      }
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
        await user.save();
      }
    } else {
      // New user - create account
      user = new User({
        googleId,
        email,
        name,
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
    const { name, email, phone, password, role, hostelName } = req.body;

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

    res.status(200).json(user);
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
    const { name, phone, hostelName } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (hostelName && req.user.role === "owner")
      updates.hostelName = hostelName;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating profile:", err);
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
