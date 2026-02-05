/**
 * Booking Routes - Complete Implementation with Separate Routers
 *
 * CHANGES FROM ORIGINAL:
 * - Added STUDENT routes (were completely missing!)
 * - Separated student and owner routes into different routers
 * - Added request cancellation endpoint
 * - Added student request history endpoint
 * - Exports both routers separately for clean mounting
 */

const express = require("express");
const bookingController = require("../controllers/bookingController");
const {
  requireAuth,
  requireOwner,
  requireStudent,
} = require("../middleware/authMiddleware");

// ============================================================================
// STUDENT ROUTER
// ============================================================================

const studentRouter = express.Router();

/**
 * @route   POST /api/students/booking-request
 * @desc    Create a new booking request
 * @access  Private (Student only)
 */
studentRouter.post(
  "/booking-request",
  requireAuth,
  requireStudent,
  bookingController.createBookingRequest,
);

/**
 * @route   GET /api/students/my-requests
 * @desc    Get all requests for the logged-in student
 * @access  Private (Student only)
 */
studentRouter.get(
  "/my-requests",
  requireAuth,
  requireStudent,
  bookingController.getStudentRequests,
);

/**
 * @route   DELETE /api/students/booking-request/:requestId
 * @desc    Cancel a pending booking request
 * @access  Private (Student only)
 */
studentRouter.delete(
  "/booking-request/:requestId",
  requireAuth,
  requireStudent,
  bookingController.cancelBookingRequest,
);

// ============================================================================
// OWNER ROUTER
// ============================================================================

const ownerRouter = express.Router();

/**
 * @route   GET /api/owner/booking-requests/mine
 * @desc    Get all pending booking requests for the logged-in owner
 * @access  Private (Owner only)
 */
ownerRouter.get(
  "/mine",
  requireAuth,
  requireOwner,
  bookingController.getOwnerBookingRequests,
);

/**
 * @route   POST /api/owner/booking-requests/:requestId/approve
 * @desc    Approve a booking request
 * @access  Private (Owner only)
 */
ownerRouter.post(
  "/:requestId/approve",
  requireAuth,
  requireOwner,
  bookingController.approveBookingRequest,
);

/**
 * @route   POST /api/owner/booking-requests/:requestId/reject
 * @desc    Reject a booking request
 * @access  Private (Owner only)
 */
ownerRouter.post(
  "/:requestId/reject",
  requireAuth,
  requireOwner,
  bookingController.rejectBookingRequest,
);

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  studentRouter,
  ownerRouter,
};

/**
 * ============================================================================
 * USAGE IN SERVER.JS
 * ============================================================================
 *
 * const { studentRouter, ownerRouter } = require("./routes/bookingRoutes");
 *
 * // Mount student booking routes
 * app.use("/api/students", studentRouter);
 *
 * // Mount owner booking routes
 * app.use("/api/owner/booking-requests", ownerRouter);
 *
 * ============================================================================
 * RESULTING ENDPOINTS
 * ============================================================================
 *
 * STUDENT ENDPOINTS:
 * POST   /api/students/booking-request           - Create request
 * GET    /api/students/my-requests               - View all requests
 * DELETE /api/students/booking-request/:id       - Cancel request
 *
 * OWNER ENDPOINTS:
 * GET    /api/owner/booking-requests/mine        - View pending
 * POST   /api/owner/booking-requests/:id/approve - Approve
 * POST   /api/owner/booking-requests/:id/reject  - Reject
 *
 */
