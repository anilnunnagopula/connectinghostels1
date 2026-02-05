const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==================== PHASE 1 MIDDLEWARE ====================

/**
 * Verify JWT token and attach user to req.user
 * ✅ UPDATED: Now checks if password was changed after token issue
 */
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach full user object to request
    const user = await User.findById(decoded.id).select(
      "-password +passwordChangedAt",
    ); // ✅ Include passwordChangedAt

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // ✅ NEW: Check if password was changed after token was issued
    if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        error: "Password was recently changed. Please log in again.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * Check if user profile is complete
 * Must be used AFTER requireAuth
 */
const requireProfileComplete = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (!req.user.profileCompleted) {
    return res.status(403).json({
      error: "Profile incomplete",
      message: "Please complete your profile before accessing this resource",
      profileCompleted: false,
    });
  }

  next();
};

/**
 * Check if user is an owner
 * Must be used AFTER requireAuth
 */
const requireOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required.",
    });
  }

  if (req.user.role !== "owner") {
    return res.status(403).json({
      error: "Access denied. Owner privileges required.",
    });
  }

  next();
};

/**
 * Check if user is a student
 * Must be used AFTER requireAuth
 */
const requireStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required.",
    });
  }

  if (req.user.role !== "student") {
    return res.status(403).json({
      error: "Access denied. Student account required.",
    });
  }

  next();
};

// ==================== 🆕 OPTIONAL: RATE LIMITING MIDDLEWARE ====================

/**
 * Rate limiter for password reset endpoints
 * Prevents abuse of forgot password feature
 * Usage: router.post('/forgot-password', passwordResetRateLimiter, forgotPassword)
 */
const passwordResetRateLimiter = (req, res, next) => {
  // This is a simple in-memory rate limiter
  // For production, use express-rate-limit or Redis

  const { email } = req.body;

  if (!email) {
    return next();
  }

  // Store attempts in memory (will reset on server restart)
  if (!global.passwordResetAttempts) {
    global.passwordResetAttempts = new Map();
  }

  const now = Date.now();
  const attempts = global.passwordResetAttempts.get(email) || [];

  // Filter attempts within last 15 minutes
  const recentAttempts = attempts.filter(
    (timestamp) => now - timestamp < 15 * 60 * 1000,
  );

  // Allow max 3 attempts per 15 minutes
  if (recentAttempts.length >= 3) {
    return res.status(429).json({
      error: "Too many password reset attempts",
      message: "Please try again in 15 minutes",
    });
  }

  // Add current attempt
  recentAttempts.push(now);
  global.passwordResetAttempts.set(email, recentAttempts);

  next();
};

// ==================== USAGE EXAMPLES ====================
/*
// Route requires authentication only
router.get('/profile', requireAuth, getProfile);

// Route requires authentication + complete profile
router.get('/dashboard', requireAuth, requireProfileComplete, getDashboard);

// Route requires authentication + complete profile + owner role
router.post('/hostels', requireAuth, requireProfileComplete, requireOwner, createHostel);

// Route requires authentication + complete profile + student role
router.post('/bookings', requireAuth, requireProfileComplete, requireStudent, createBooking);

// ✅ NEW: Password reset with rate limiting
router.post('/forgot-password', passwordResetRateLimiter, forgotPassword);
*/

module.exports = {
  requireAuth,
  requireProfileComplete,
  requireOwner,
  requireStudent,
  passwordResetRateLimiter, // ✅ NEW
};
