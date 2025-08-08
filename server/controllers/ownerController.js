const mongoose = require("mongoose"); // ✅ ADD THIS LINE
const Hostel = require("../models/Hostel");
const Complaint = require("../models/Complaint");
const Student = require("../models/Student");

exports.getOwnerDashboardMetrics = async (req, res) => {
  try {
    const ownerId = req.user.id; // from JWT decoded user
    const totalHostels = await Hostel.countDocuments({ owner: ownerId });

    const roomsFilled = await Student.countDocuments({ owner: ownerId });
    const totalStudents = await Student.countDocuments({ owner: ownerId });
    const complaintsCount = await Complaint.countDocuments({
      owner: ownerId,
      status: "Pending",
    });

    // The error is here, where `mongoose.Types.ObjectId` is used without importing mongoose.
    const totalRooms = await Hostel.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(ownerId) } }, // This line needs mongoose
      { $group: { _id: null, total: { $sum: "$rooms" } } },
    ]);
    const availableRooms = totalRooms[0]
      ? totalRooms[0].total - roomsFilled
      : 0;

    res.json({
      totalHostels,
      roomsFilled,
      studentsCount: totalStudents,
      complaintsCount,
      availableRooms,
    });
  } catch (err) {
    console.error("🚨 Error in dashboard metrics:", err);
    res.status(500).json({ error: "Server error" });
  }
};
