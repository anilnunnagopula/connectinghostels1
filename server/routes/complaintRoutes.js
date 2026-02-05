const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");
const {
  requireAuth,
  requireOwner,
  requireStudent,
} = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// ============================================================================
// FILE UPLOAD CONFIGURATION
// ============================================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/complaints/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed!"));
    }
  },
});

// ============================================================================
// ROUTES
// ============================================================================

// Student routes
router.post(
  "/",
  requireAuth,
  requireStudent,
  upload.array("files", 5), // Max 5 files
  complaintController.createComplaint,
);

router.get(
  "/my-complaints",
  requireAuth,
  requireStudent,
  complaintController.getStudentComplaints,
);

// Owner routes
router.get(
  "/mine",
  requireAuth,
  requireOwner,
  complaintController.getOwnerComplaints,
);

router.delete(
  "/:complaintId",
  requireAuth,
  requireOwner,
  complaintController.deleteComplaint,
);

module.exports = router;
