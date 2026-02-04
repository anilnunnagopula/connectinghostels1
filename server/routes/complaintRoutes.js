const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// Route to get all complaints for the authenticated owner
router.get(
  "/mine",
  requireAuth,
  requireOwner,
  requireOwner,
  complaintController.getOwnerComplaints
);

// Route to get student's complaints
router.get(
    "/my-complaints",
    requireAuth,
    // requireStudent, // Add back if strict role check needed
    complaintController.getStudentComplaints
);

// Route to create a complaint (Students)
router.post(
    "/",
    requireAuth,
    // requireStudent, 
    complaintController.createComplaint
);

// Route to delete a specific complaint
router.delete(
  "/:complaintId",
  requireAuth,
  requireOwner,
  complaintController.deleteComplaint
);

module.exports = router;
