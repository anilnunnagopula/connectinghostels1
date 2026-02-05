const Complaint = require("../models/Complaint");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const mongoose = require("mongoose");

// ============================================================================
// STUDENT ACTIONS
// ============================================================================

/**
 * Create a new complaint
 * @route POST /api/complaints
 */
exports.createComplaint = async (req, res) => {
  try {
    const { subject, message, type, room, hostelId } = req.body;
    const userId = req.user.id;

    console.log("📝 Creating complaint:", {
      userId,
      subject,
      type,
      room,
      hostelId,
    });

    // Find student profile
    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({
        error: "Student profile not found. Please complete your profile first.",
      });
    }

    // Check if student has an active hostel
    if (!student.currentHostel) {
      return res.status(400).json({
        error: "You must be assigned to a hostel to raise complaints.",
      });
    }

    // Use provided hostelId or student's current hostel
    const targetHostelId = hostelId || student.currentHostel;

    // Verify hostel exists
    const hostel = await Hostel.findById(targetHostelId);
    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found." });
    }

    console.log("✅ Hostel found:", {
      hostelId: hostel._id,
      ownerId: hostel.ownerId,
      name: hostel.name,
    });

    // Handle file attachments
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          filename: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
        });
      });
    }

    // Create complaint
    const newComplaint = new Complaint({
      student: student._id,
      hostel: targetHostelId,
      owner: hostel.ownerId,
      room,
      subject,
      message,
      type,
      issue: `${subject} - ${message}`, // Backward compatibility
      attachments,
      status: "Pending",
    });

    await newComplaint.save();

    console.log("✅ Complaint created:", newComplaint._id);

    res.status(201).json({
      message: "Complaint submitted successfully!",
      complaint: {
        id: newComplaint._id,
        subject: newComplaint.subject,
        type: newComplaint.type,
        status: newComplaint.status,
        createdAt: newComplaint.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Error creating complaint:", err);
    res.status(500).json({
      error: "Failed to submit complaint.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Get student's own complaints
 * @route GET /api/complaints/my-complaints
 */
exports.getStudentComplaints = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("📋 Fetching complaints for user:", userId);

    // Find student profile
    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    // Get all complaints for this student
    const complaints = await Complaint.find({ student: student._id })
      .populate("hostel", "name location")
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    console.log("📦 Found complaints:", complaints.length);

    res.status(200).json({
      complaints,
      count: complaints.length,
    });
  } catch (err) {
    console.error("❌ Error fetching student complaints:", err);
    res.status(500).json({ error: "Failed to fetch complaints." });
  }
};

// ============================================================================
// OWNER ACTIONS
// ============================================================================

/**
 * Get all complaints for owner's hostels
 * @route GET /api/complaints/mine
 */
exports.getOwnerComplaints = async (req, res) => {
  try {
    const ownerId = req.user.id;

    console.log("📋 Fetching complaints for owner:", ownerId);

    // Get all complaints where the owner matches
    const complaints = await Complaint.find({ owner: ownerId })
      .populate("student", "name email phone")
      .populate("hostel", "name location")
      .sort({ createdAt: -1 });

    console.log("📦 Found owner complaints:", complaints.length);

    res.status(200).json({
      complaints,
      count: complaints.length,
    });
  } catch (err) {
    console.error("❌ Error fetching owner complaints:", err);
    res.status(500).json({ error: "Failed to fetch complaints." });
  }
};

/**
 * Delete/Resolve a complaint
 * @route DELETE /api/complaints/:complaintId
 */
exports.deleteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const ownerId = req.user.id;

    console.log("🗑️ Deleting complaint:", { complaintId, ownerId });

    // Find and verify ownership
    const complaint = await Complaint.findOne({
      _id: complaintId,
      owner: ownerId,
    });

    if (!complaint) {
      return res.status(404).json({
        error: "Complaint not found or you don't have permission to delete it.",
      });
    }

    // Delete the complaint
    await Complaint.findByIdAndDelete(complaintId);

    console.log("✅ Complaint deleted successfully");

    res.status(200).json({
      message: "Complaint resolved and deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Error deleting complaint:", err);
    res.status(500).json({ error: "Failed to delete complaint." });
  }
};

module.exports = exports;
