const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { requireAuth, requireStudent } = require("../middleware/authMiddleware");

router.get(
  "/bill",
  requireAuth,
  requireStudent,
  paymentController.getStudentBill
);
router.get(
  "/payments",
  requireAuth,
  requireStudent,
  paymentController.getStudentPaymentHistory
);
router.post(
  "/payments/create-order",
  requireAuth,
  requireStudent,
  paymentController.createRazorpayOrder
);
router.post(
  "/payments/verify",
  requireAuth,
  requireStudent,
  paymentController.verifyPayment
);

module.exports = router;
