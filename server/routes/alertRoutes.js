const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alertController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// Route to send alerts to selected students
router.post("/send", requireAuth, requireOwner, alertController.sendAlerts);

module.exports = router;
