const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostelController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");
const multer = require("multer");

// Multer config
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ✅ Only this route — supports images/videos
router.post(
  "/add-hostel", // This is the route path within this router
  requireAuth,
  requireOwner,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  hostelController.addHostel
);

module.exports = router;
