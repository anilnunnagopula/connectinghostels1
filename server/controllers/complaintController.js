const Complaint = require("../models/Complaint");

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
