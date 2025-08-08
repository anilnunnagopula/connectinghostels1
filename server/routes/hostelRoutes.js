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

// Route to add a new hostel
router.post(
  "/add-hostel",
  requireAuth,
  requireOwner,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  hostelController.addHostel
);

// Route to get all hostels for the authenticated owner
router.get(
  "/my-hostels",
  requireAuth,
  requireOwner,
  hostelController.getMyHostels
);

module.exports = router;
