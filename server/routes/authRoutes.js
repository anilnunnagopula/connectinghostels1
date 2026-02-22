const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { passwordResetLimiter, loginLimiter } = require("../middleware/rateLimiter");
const {
  validate,
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  completeProfileRules,
  updateProfileRules,
} = require("../middleware/validators/authValidators");
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

// Google OAuth
router.post("/google", googleAuth);
router.post("/complete-profile", requireAuth, completeProfileRules, validate, completeProfile);

// Email/password auth
router.post("/register", registerRules, validate, registerWithEmail);
router.post("/login", loginLimiter, loginRules, validate, loginWithEmail);

// Password reset
router.post("/forgot-password", passwordResetLimiter, forgotPasswordRules, validate, forgotPassword);
router.post("/reset-password/:token", resetPasswordRules, validate, resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);

// Profile
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfileRules, validate, updateProfile);
router.post("/logout", requireAuth, logout);

module.exports = router;
