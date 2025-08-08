const express = require("express");
const router = express.Router();
const ownerPaymentController = require("../controllers/ownerPaymentController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// Route to get the owner's payment settings
router.get(
  "/payment-settings",
  requireAuth,
  requireOwner,
  ownerPaymentController.getPaymentSettings
);

// Route to save or update the owner's payment settings
router.post(
  "/payment-settings",
  requireAuth,
  requireOwner,
  ownerPaymentController.savePaymentSettings
);

// ✅ NEW: Route to get payout methods
router.get(
  "/payout-methods",
  requireAuth,
  requireOwner,
  ownerPaymentController.getPayoutMethods
);

// ✅ NEW: Route to get payout history
router.get(
  "/payout-history",
  requireAuth,
  requireOwner,
  ownerPaymentController.getPayoutHistory
);

module.exports = router;
