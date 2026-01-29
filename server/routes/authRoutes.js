const express = require("express");
const router = express.Router();
const {
  requireAuth,
  passwordResetRateLimiter,
} = require("../middleware/authMiddleware");
const {
  googleAuth,
  completeProfile,
  registerWithEmail,
  loginWithEmail,
  getProfile,
  updateProfile,
  logout,
  forgotPassword, 
  resetPassword, 
  verifyResetToken, 
} = require("../controllers/authController");

// ==================== GOOGLE OAUTH ROUTES ====================

/**
 * POST /api/auth/google
 * Handle Google OAuth login/signup
 * Body: { credential: "google_access_token" }
 */
router.post("/google", googleAuth);

/**
 * POST /api/auth/complete-profile
 * Complete user profile after OAuth (add role, phone, etc.)
 * Requires: Authentication
 * Body: { role, phone, hostelName? }
 */
router.post("/complete-profile", requireAuth, completeProfile);

// ==================== EMAIL/PASSWORD AUTH ROUTES ====================

/**
 * POST /api/auth/register
 * Register with email/password
 * Body: { name, email, phone, password, role, hostelName? }
 */
router.post("/register", registerWithEmail);

/**
 * POST /api/auth/login
 * Login with email/password
 * Body: { email, password, role? }
 */
router.post("/login", loginWithEmail);

// ==================== 🆕 PASSWORD RESET ROUTES ====================

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 * Public route
 * Body: { email }
 */
router.post("/forgot-password", forgotPassword);

/**
 * POST /api/auth/reset-password/:token
 * Reset password using token from email
 * Public route
 * Body: { password, confirmPassword }
 */
router.post("/reset-password/:token", resetPassword);

/**
 * GET /api/auth/verify-reset-token/:token
 * Verify if reset token is valid (optional - for frontend validation)
 * Public route
 */
router.get("/verify-reset-token/:token", verifyResetToken);

// Apply rate limiter to forgot password
router.post("/forgot-password", passwordResetRateLimiter, forgotPassword);
// ==================== PROFILE MANAGEMENT ROUTES ====================

/**
 * GET /api/auth/profile
 * Get current user profile
 * Requires: Authentication
 */
router.get("/profile", requireAuth, getProfile);

/**
 * PUT /api/auth/profile
 * Update user profile
 * Requires: Authentication
 * Body: { name?, phone?, hostelName? }
 */
router.put("/profile", requireAuth, updateProfile);

/**
 * POST /api/auth/logout
 * Logout (token removal happens on frontend)
 * Requires: Authentication
 */
router.post("/logout", requireAuth, logout);

module.exports = router;
