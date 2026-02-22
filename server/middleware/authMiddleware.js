const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("./logger");

/**
 * Verify JWT token and attach user to req.user.
 * Checks httpOnly cookie first, falls back to Authorization header.
 */
const requireAuth = async (req, res, next) => {
  let token;

  // 1. Prefer httpOnly cookie (XSS-safe)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback: Authorization header (supports legacy clients during transition)
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password +passwordChangedAt");

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    // Reject banned accounts
    if (user.isBanned) {
      return res.status(403).json({ error: "Your account has been suspended. Contact support." });
    }

    // Invalidate tokens issued before a password change
    if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        error: "Password was recently changed. Please log in again.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    logger.warn(`Auth failed for ${req.method} ${req.path}: ${err.message}`);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * Check if user profile is complete. Must be used AFTER requireAuth.
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
 * Check if user is an owner. Must be used AFTER requireAuth.
 */
const requireOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.user.role !== "owner") {
    return res.status(403).json({ error: "Access denied. Owner privileges required." });
  }
  next();
};

/**
 * Check if user is a student. Must be used AFTER requireAuth.
 */
const requireStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.user.role !== "student") {
    return res.status(403).json({ error: "Access denied. Student account required." });
  }
  next();
};

/**
 * Check if user is an admin. Must be used AFTER requireAuth.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin privileges required." });
  }
  next();
};

module.exports = {
  requireAuth,
  requireProfileComplete,
  requireOwner,
  requireStudent,
  requireAdmin,
};
