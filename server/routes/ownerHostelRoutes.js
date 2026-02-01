const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostelController");
const ownerController = require("../controllers/ownerController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");
const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
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

module.exports = router;
