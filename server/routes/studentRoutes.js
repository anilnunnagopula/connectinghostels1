const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const {
  requireAuth,
  requireOwner,
  requireStudent,
} = require("../middleware/authMiddleware");

// Route to add a new student
// Route to add a new student
router.post("/", requireAuth, requireOwner, studentController.addStudent);

// Route to delete a student
router.delete("/:id", requireAuth, requireOwner, studentController.deleteStudent);

// Route to get all students for a specific owner
router.get(
  "/mine",
  requireAuth,
  requireOwner,
  studentController.getOwnerStudents
);

// ✅ UPDATED: Route to get student dashboard metrics
router.get(
  "/dashboard/metrics",
  requireAuth,
  requireStudent,
  studentController.getStudentDashboardMetrics
);

// ✅ NEW: Student routes
router.get(
  "/my-hostel",
  requireAuth,
  requireStudent,
  studentController.getStudentHostel
);
router.get(
  "/bookings",
  requireAuth,
  requireStudent,
  studentController.getStudentBookings
);
router.get(
  "/search-hostel",
  requireAuth,
  // requireStudent, // Allow owners to view hostels too
  studentController.searchHostels
);
router.post(
  "/booking-request",
  requireAuth,
  requireStudent,
  studentController.createBookingRequest
);

// ✅ NEW: Interested / Wishlist Routes
router.get(
  "/interested",
  requireAuth,
  requireStudent,
  studentController.getInterestedHostels
);
router.post(
  "/interested/:hostelId",
  requireAuth,
  requireStudent,
  studentController.toggleInterestedHostel
);
router.delete(
  "/interested/all",
  requireAuth,
  requireStudent,
  studentController.clearInterestedHostels
);
router.delete(
  "/interested/:hostelId",
  requireAuth,
  requireStudent,
  studentController.removeInterestedHostel
);

module.exports = router;
