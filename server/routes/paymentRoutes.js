/**
 * Payment Routes - SIMPLE VERSION
 * Only 3 routes: create order, verify payment, get history
 */

const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { requireAuth, requireStudent } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/payments/create-order
 * @desc    Create Razorpay order for payment
 * @access  Private (Student only)
 */
router.post(
  "/create-order",
  requireAuth,
  requireStudent,
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

module.exports = router;
