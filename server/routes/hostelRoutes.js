const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostelController");
// const { authMiddleware, requireOwner } = require("../middleware/authMiddleware");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");
router.post("/add", requireAuth, requireOwner, hostelController.addHostel); // ✅ Secure
// Add multer middleware setup
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Update route
router.post(
  "/add",
  requireAuth,
  requireOwner,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  hostelController.addHostel
);

// other routes...
module.exports = router;
