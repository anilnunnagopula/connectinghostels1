const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// IMPORTANT: A proper room management system should have a Room model.
// These routes are designed to be used once a Room model is in place.
// For now, they are placeholders.

// Route to get details for a specific room
// URL would be something like: /api/owner/rooms/:hostelId/:roomNo
router.get(
  "/:hostelId/:roomNo",
  requireAuth,
  requireOwner,
  roomController.getRoomDetails
);

// Route to update the status of a room (e.g., toggle filled/vacant)
// URL would be: /api/owner/rooms/:hostelId/:roomNo/status
router.put(
  "/:hostelId/:roomNo/status",
  requireAuth,
  requireOwner,
  roomController.updateRoomStatus
);

// Route to edit the details of a room
// URL would be: /api/owner/rooms/:hostelId/:roomNo/edit
router.put(
  "/:hostelId/:roomNo/edit",
  requireAuth,
  requireOwner,
  roomController.editRoomDetails
);

module.exports = router;
