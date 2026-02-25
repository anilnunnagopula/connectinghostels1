/**
 * Payment Routes
 */

const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { requireAuth, requireStudent } = require("../middleware/authMiddleware");
const { validate, createPaymentOrderRules } = require("../middleware/validators/bookingValidators");

/**
 * @route   POST /api/payments/create-order
 * @desc    Create Razorpay order for payment
 * @access  Private (Student only)
 */
router.post(
  "/create-order",
  requireAuth,
  requireStudent,
  createPaymentOrderRules,
  validate,
  paymentController.createOrder,
);

/**
 * @route   POST /api/payments/verify
 * @desc    Verify payment signature and save to DB
 * @access  Private (Student only)
 */
router.post(
  "/verify",
  requireAuth,
  requireStudent,
  paymentController.verifyPayment,
);

/**
 * @route   GET /api/payments/my-payments
 * @desc    Get student's payment history
 * @access  Private (Student only)
 */
router.get(
  "/my-payments",
  requireAuth,
  requireStudent,
  paymentController.getMyPayments,
);

/**
 * @route   POST /api/payments/webhook
 * @desc    Handle Razorpay webhook events (no auth — verified via HMAC signature)
 * @access  Public
 */
router.post("/webhook", paymentController.handleWebhook);

module.exports = router;
