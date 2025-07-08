const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const Complaint = require("../models/Complaint");
const Student = require("../models/Student");

exports.getOwnerDashboardMetrics = async (req, res) => {
  try {
    const ownerId = req.user.id; // from JWT decoded user

    const totalHostels = await Hostel.countDocuments({ owner: ownerId });

    const rooms = await Room.find({ owner: ownerId });
    const roomsFilled = rooms.reduce(
      (count, room) => count + room.filledBeds,
      0
    );
    const availableRooms = rooms.reduce(
      (count, room) => count + (room.totalBeds - room.filledBeds),
      0
    );

    const studentsCount = await Student.countDocuments({ owner: ownerId });

    const complaintsCount = await Complaint.countDocuments({ owner: ownerId });

    res.json({
      totalHostels,
      roomsFilled,
      studentsCount,
      complaintsCount,
      availableRooms,
    });
  } catch (err) {
    console.error("🚨 Error in dashboard metrics:", err);
    res.status(500).json({ error: "Server error" });
  }
};
