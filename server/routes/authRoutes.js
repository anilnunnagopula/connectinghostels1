// const express = require("express");
// const router = express.Router();
// const {
//   registerUser,
//   loginUser,
//   sendOtp,
//   verifyOtp,
// } = require("../controllers/authController");

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.post("/send-otp", sendOtp);
// router.post("/verify-otp", verifyOtp);

// module.exports = router;
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  getProfile, // ✅ NEW: Import getProfile
  updateProfile, // ✅ NEW: Import updateProfile
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware"); // ✅ NEW: Import requireAuth

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// ✅ NEW: Route to get the user's profile
router.get("/profile", requireAuth, getProfile);

// ✅ NEW: Route to update the user's profile
router.put("/profile", requireAuth, updateProfile);

module.exports = router;