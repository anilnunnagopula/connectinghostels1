const express = require("express");
const router = express.Router();
const ownerPaymentController = require("../controllers/ownerPaymentController"); // ✅ Corrected file name
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// All top-level owner payment routes go here
router.get(
  "/payment-settings",
  requireAuth,
  requireOwner,
  ownerPaymentController.getPaymentSettings
);

router.post(
  "/payment-settings",
  requireAuth,
  requireOwner,
  ownerPaymentController.savePaymentSettings
);

router.get(
  "/payout-methods",
  requireAuth,
  requireOwner,
  ownerPaymentController.getPayoutMethods
);

router.get(
  "/payout-history",
  requireAuth,
  requireOwner,
  ownerPaymentController.getPayoutHistory
);

module.exports = router;
