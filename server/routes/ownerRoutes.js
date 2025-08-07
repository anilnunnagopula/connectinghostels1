const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// Route to get all dashboard metrics for the authenticated owner
router.get(
  "/dashboard/metrics",
  requireAuth,
  requireOwner,
  ownerController.getOwnerDashboardMetrics
);

module.exports = router;
