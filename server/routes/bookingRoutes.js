const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// Route to get all pending booking requests for the authenticated owner
router.get(
  "/mine",
  requireAuth,
  requireOwner,
  bookingController.getOwnerBookingRequests
);

// Route to approve a booking request
router.post(
  "/:requestId/approve",
  requireAuth,
  requireOwner,
  bookingController.approveBookingRequest
);

// Route to reject a booking request
router.post(
  "/:requestId/reject",
  requireAuth,
  requireOwner,
  bookingController.rejectBookingRequest
);

module.exports = router;
