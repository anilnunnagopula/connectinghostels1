/**
 * Owner Payment Routes
 */

const express = require("express");
const router = express.Router();
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");
const ownerPaymentController = require("../controllers/ownerPaymentController");

router.get(
  "/payments",
  requireAuth,
  requireOwner,
  ownerPaymentController.getOwnerPayments,
);

module.exports = router;
