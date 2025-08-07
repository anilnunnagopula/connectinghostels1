// routes/hostelRoutes.js
const express = require("express");
const router = express.Router();

// ✅ Make sure this import is correct and the file path is right.
const hostelController = require("../controllers/hostelController");

// The TypeError is almost always because `hostelController` is defined,
// but `hostelController.getMyHostels` is undefined.
// This happens if there's a typo, like `hostelControllar.getMyHostels`.

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

// ✅ Route to add a new hostel
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

// ✅ Check for typos here. It must be `hostelController.getMyHostels`.
router.get(
  "/my-hostels",
  requireAuth,
  requireOwner,
  hostelController.getMyHostels
);

module.exports = router;
