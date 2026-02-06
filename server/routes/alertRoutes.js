const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alertController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// ✅ Send alerts to students
router.post("/send", requireAuth, requireOwner, alertController.sendAlerts);

// ✅ Get alert history
router.get(
  "/history",
  requireAuth,
  requireOwner,
  alertController.getAlertHistory,
);

module.exports = router;
