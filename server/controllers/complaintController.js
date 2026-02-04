const Complaint = require("../models/Complaint");
const Booking = require("../models/StudentHostel"); // Assuming this is the booking model name
const Student = require("../models/Student");

exports.createComplaint = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { title, description, type } = req.body;

    // 1. Find the student's active hostel/booking to link the complaint
    // We need to know WHICH hostel/owner this complaint is for.
    // Option A: Check active booking
    const activeBooking = await Booking.findOne({ 
        student: studentId, 
        status: "Active" 
    }).populate("hostel");

    // Option B: Check Student model if it has direct hostel link
    // const student = await Student.findById(studentId);
    
    if (!activeBooking) {
        return res.status(400).json({ message: "You don't have an active hostel booking to raise a complaint." });
    }

    const complaint = new Complaint({
        student: studentId,
        hostel: activeBooking.hostel._id,
        owner: activeBooking.owner, // Crucial: Link to the owner
        title,
        description,
        type: type || "General",
        status: "Pending",
        date: new Date()
    });

    await complaint.save();

    res.status(201).json({ message: "Complaint raised successfully", complaint });

  } catch (err) {
    console.error("Error creating complaint:", err);
    res.status(500).json({ message: "Failed to raise complaint." });
  }
};

exports.getStudentComplaints = async (req, res) => {
    try {
        const studentId = req.user.id;
        const complaints = await Complaint.find({ student: studentId })
            .populate("hostel", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ complaints });
    } catch (err) {
        console.error("Error fetching student complaints:", err);
        res.status(500).json({ message: "Failed to fetch complaints." });
    }
};

exports.getOwnerComplaints = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const complaints = await Complaint.find({ owner: ownerId })
      .populate("student", "name")
      .populate("hostel", "name");

    res.status(200).json({ complaints });
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ message: "Failed to fetch complaints." });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaintId = req.params.complaintId;
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    // Ensure only the owner can delete their own complaint
    if (complaint.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this complaint." });
    }

    await complaint.deleteOne();
    res.status(200).json({ message: "Complaint deleted successfully." });
  } catch (err) {
    console.error("Error deleting complaint:", err);
    res.status(500).json({ message: "Failed to delete complaint." });
  }
};
