const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { requireAuth, requireStudent, requireOwner } = require("../middleware/authMiddleware");

// Student Routes
router.get(
  "/dues",
  requireAuth,
  requireStudent,
  paymentController.getStudentDues
);
router.get(
  "/history",
  requireAuth,
  requireStudent,
  paymentController.getStudentPaymentHistory
);
router.post(
  "/create-order",
  requireAuth, // Could be student or eventually owner initiating? Usually student.
  requireStudent,
  paymentController.createRazorpayOrder
);
router.post(
  "/verify",
  requireAuth,
  requireStudent,
  paymentController.verifyPayment
);

// Owner Routes
router.post(
    "/record-cash",
    requireAuth,
    requireOwner,
    paymentController.recordCashPayment
);

router.post(
    "/create-due",
    requireAuth,
    requireOwner,
    paymentController.createDue
);

module.exports = router;
