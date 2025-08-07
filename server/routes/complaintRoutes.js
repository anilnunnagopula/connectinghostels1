const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// Route to get all complaints for the authenticated owner
router.get(
  "/mine",
  requireAuth,
  requireOwner,
  complaintController.getOwnerComplaints
);

// Route to delete a specific complaint
router.delete(
  "/:complaintId",
  requireAuth,
  requireOwner,
  complaintController.deleteComplaint
);

module.exports = router;
