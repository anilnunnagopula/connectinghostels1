const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostelController");
const ownerController = require("../controllers/ownerController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");
const { getStorage } = require("../storage/storageAdapter");
const multer = require("multer");
const path = require("path");

const ALLOWED_IMAGE_TYPES = /jpeg|jpg|png|webp/;

const upload = multer({
  storage: getStorage("uploads/", "hostel-images/"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per file
  fileFilter: (req, file, cb) => {
    const extOk = ALLOWED_IMAGE_TYPES.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = ALLOWED_IMAGE_TYPES.test(file.mimetype);
    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
  },
});

// ========== DASHBOARD ROUTES ==========
router.get(
  "/dashboard/metrics",
  requireAuth,
  requireOwner,
  ownerController.getOwnerDashboardMetrics,
);

router.get(
  "/dashboard/notifications",
  requireAuth,
  requireOwner,
  ownerController.getOwnerNotifications,
);

router.get(
  "/dashboard/hostel/:hostelId/stats",
  requireAuth,
  requireOwner,
  ownerController.getHostelQuickStats,
);

// ========== HOSTEL ROUTES ==========
router.post(
  "/add-hostel",
  requireAuth,
  requireOwner,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  hostelController.addHostel,
);

router.get(
  "/my-hostels",
  requireAuth,
  requireOwner,
  hostelController.getMyHostels,
);

router.get(
  "/:id",
  requireAuth,
  requireOwner,
  hostelController.getOwnerHostelById,
);

module.exports = router;
