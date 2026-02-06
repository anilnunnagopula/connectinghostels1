const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const {
  requireAuth,
  requireOwner,
  requireStudent,
} = require("../middleware/authMiddleware");

// Route to add a new student
router.post("/", requireAuth, requireOwner, studentController.addStudent);

// Route to delete a student
router.delete(
  "/:id",
  requireAuth,
  requireOwner,
  studentController.deleteStudent,
);

// ✅ FIX: Changed route name to avoid confusion - this gets students owned by owner
// This is what your alerts page needs!
router.get(
  "/mine",
  requireAuth,
  requireOwner,
  studentController.getOwnerStudents,
);

// ✅ UPDATED: Route to get student dashboard metrics
router.get(
  "/dashboard/metrics",
  requireAuth,
  requireStudent,
  studentController.getStudentDashboardMetrics,
);

const bookingController = require("../controllers/bookingController");

// ✅ NEW: Student routes
router.get(
  "/my-hostel",
  requireAuth,
  requireStudent,
  studentController.getStudentHostel,
);
router.get(
  "/bookings",
  requireAuth,
  requireStudent,
  studentController.getStudentBookings,
);
router.get(
  "/search-hostel",
  requireAuth,
  // requireStudent, // Allow owners to view hostels too
  studentController.searchHostels,
);

// ✅ NEW: Student Booking Request Routes
router.post(
  "/booking-request",
  requireAuth,
  requireStudent,
  bookingController.createBookingRequest,
);
router.get(
  "/my-requests",
  requireAuth,
  requireStudent,
  bookingController.getStudentRequests,
);
router.delete(
  "/booking-request/:requestId",
  requireAuth,
  requireStudent,
  bookingController.cancelBookingRequest,
);

// ✅ NEW: Interested / Wishlist Routes
router.get(
  "/interested",
  requireAuth,
  requireStudent,
  studentController.getInterestedHostels,
);
router.post(
  "/interested/:hostelId",
  requireAuth,
  requireStudent,
  studentController.toggleInterestedHostel,
);
router.delete(
  "/interested/all",
  requireAuth,
  requireStudent,
  studentController.clearInterestedHostels,
);
router.delete(
  "/interested/:hostelId",
  requireAuth,
  requireStudent,
  studentController.removeInterestedHostel,
);

// ✅ NEW: Recently Viewed Routes
router.get(
  "/recently-viewed",
  requireAuth,
  requireStudent,
  studentController.getRecentlyViewed,
);
router.post(
  "/recently-viewed",
  requireAuth,
  requireStudent,
  studentController.addToRecentlyViewed,
);
router.delete(
  "/recently-viewed/all",
  requireAuth,
  requireStudent,
  studentController.clearRecentlyViewed,
);
router.delete(
  "/recently-viewed/:hostelId",
  requireAuth,
  requireStudent,
  studentController.removeFromRecentlyViewed,
);
router.get(
  "/my-roommates",
  requireAuth,
  requireStudent,
  studentController.getMyRoommates,
);
module.exports = router;
