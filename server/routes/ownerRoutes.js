const express = require("express");
const router = express.Router();
const { getOwnerDashboardMetrics } = require("../controllers/ownerController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// 👉 Protect route by auth + owner
router.get(
  "/dashboard-metrics",
  requireAuth,
  requireOwner,
  getOwnerDashboardMetrics
);

module.exports = router;
