const Room = require("../models/Room");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");

// IMPORTANT: A proper room management system should have its own Room model.
// For now, we will add placeholder functions that would eventually
// interact with a separate Room model.

// Placeholder function to get room details.
// This is not used by the current frontend, but is a good practice.
exports.getRoomDetails = async (req, res) => {
  try {
    // You would use `Room.find({ hostel: req.params.hostelId, roomNumber: req.params.roomNo })`
    // once you have a Room model.
    res.status(200).json({ message: "Room details will be implemented here." });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch room details." });
  }
};

// Placeholder function to update room status (e.g., mark as vacant/filled)
exports.updateRoomStatus = async (req, res) => {
  try {
    const { hostelId, roomNo } = req.params;
    const { status } = req.body;

    // In a real application, you would update the `status` field in the Room model.
    // We would also need to update the `student` documents to reflect the change,
    // for example, by unassigning them from the room.

    // For now, this is a conceptual placeholder.
    res.status(200).json({
      message: `Room ${roomNo} in Hostel ${hostelId} status updated to ${status}.`,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update room status." });
  }
};

// Placeholder function to edit room details
exports.editRoomDetails = async (req, res) => {
  try {
    const { hostelId, roomNo } = req.params;
    const { newDetails } = req.body;

    // You would update the Room model with `newDetails` here.

    res.status(200).json({
      message: `Room ${roomNo} in Hostel ${hostelId} details updated.`,
      newDetails,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to edit room details." });
  }
};
