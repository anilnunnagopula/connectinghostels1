const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const Complaint = require("../models/Complaint");
const Student = require("../models/Student");

exports.getOwnerDashboardMetrics = async (req, res) => {
  try {
    const ownerId = req.user.id; // from JWT decoded user
    const totalHostels = await Hostel.countDocuments({ owner: ownerId }); // These are your key counts

    const roomsFilled = await Student.countDocuments({ owner: ownerId }); // Count students as filled rooms for now
    const totalStudents = await Student.countDocuments({ owner: ownerId });
    const complaintsCount = await Complaint.countDocuments({
      owner: ownerId,
      status: "Pending",
    }); // This part might need a more complex query if you have different room capacities

    const totalRooms = await Hostel.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(ownerId) } },
      { $group: { _id: null, total: { $sum: "$rooms" } } },
    ]);
    const availableRooms = totalRooms[0]
      ? totalRooms[0].total - roomsFilled
      : 0;

    res.json({
      totalHostels,
      roomsFilled,
      studentsCount: totalStudents, // The frontend expects 'studentsCount'
      complaintsCount,
      availableRooms,
    });
  } catch (err) {
    console.error("🚨 Error in dashboard metrics:", err);
    res.status(500).json({ error: "Server error" });
  }
};