const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==================== PHASE 1 MIDDLEWARE ====================

/**
 * Verify JWT token and attach user to req.user
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
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
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
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "owner") {
    return res.status(403).json({ error: "Access denied. Owners only." });
  }

  next();
};

/**
 * Check if user is a student
 * Must be used AFTER requireAuth
 */
const requireStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "student") {
    return res.status(403).json({ error: "Access denied. Students only." });
  }

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
*/

module.exports = {
  requireAuth,
  requireProfileComplete,
  requireOwner,
  requireStudent,
};
