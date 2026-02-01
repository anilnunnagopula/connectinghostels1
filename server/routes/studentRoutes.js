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
  requireStudent,
  studentController.searchHostels
);
router.post(
  "/booking-request",
  requireAuth,
  requireStudent,
  studentController.createBookingRequest
);

module.exports = router;
