const Complaint = require("../models/Complaint");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const logger = require("../middleware/logger");

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

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({
        error: "Student profile not found. Please complete your profile first.",
      });
    }

    if (!student.currentHostel) {
      return res.status(400).json({
        error: "You must be assigned to a hostel to raise complaints.",
      });
    }

    const targetHostelId = hostelId || student.currentHostel;

    const hostel = await Hostel.findById(targetHostelId);
    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found." });
    }

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

    const newComplaint = new Complaint({
      student: student._id,
      hostel: targetHostelId,
      owner: hostel.ownerId,
      room,
      subject,
      message,
      type,
      issue: `${subject} - ${message}`,
      attachments,
      status: "Pending",
    });

    await newComplaint.save();

    logger.info(`Complaint created: complaintId=${newComplaint._id} studentId=${student._id}`);

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
    logger.error("Error creating complaint: " + err.message);
    res.status(500).json({
      error: "Failed to submit complaint.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Get student's own complaints (paginated)
 * @route GET /api/complaints/my-complaints?page=1&limit=20
 */
exports.getStudentComplaints = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    const filter = { student: student._id };

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate("hostel", "name location")
        .populate("owner", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments(filter),
    ]);

    res.status(200).json({
      complaints,
      count: complaints.length,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    logger.error("Error fetching student complaints: " + err.message);
    res.status(500).json({ error: "Failed to fetch complaints." });
  }
};

// ============================================================================
// OWNER ACTIONS
// ============================================================================

/**
 * Get all complaints for owner's hostels (paginated)
 * @route GET /api/complaints/mine?page=1&limit=20
 */
exports.getOwnerComplaints = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = { owner: ownerId };

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate("student", "name email phone")
        .populate("hostel", "name location")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments(filter),
    ]);

    res.status(200).json({
      complaints,
      count: complaints.length,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    logger.error("Error fetching owner complaints: " + err.message);
    res.status(500).json({ error: "Failed to fetch complaints." });
  }
};

/**
 * Update complaint status (Owner)
 * @route PUT /api/complaints/:complaintId/status
 */
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;
    const ownerId = req.user.id;

    const allowed = ["Pending", "In Progress", "Resolved"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${allowed.join(", ")}` });
    }

    const complaint = await Complaint.findOne({ _id: complaintId, owner: ownerId })
      .populate("student", "user");

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found or unauthorized." });
    }

    complaint.status = status;
    await complaint.save();

    logger.info(`Complaint status updated: complaintId=${complaintId} status=${status}`);

    // Notify the student in real-time (non-blocking)
    try {
      const studentUserId = complaint.student?.user;
      if (studentUserId) {
        req.app?.locals?.io
          ?.to(`user:${studentUserId}`)
          .emit("complaint:updated", {
            complaintId: complaint._id,
            subject: complaint.subject,
            status,
          });
      }
    } catch (emitErr) {
      logger.warn("Failed to emit complaint:updated: " + emitErr.message);
    }

    res.status(200).json({ message: "Complaint status updated.", status });
  } catch (err) {
    logger.error("Error updating complaint status: " + err.message);
    res.status(500).json({ error: "Failed to update complaint status." });
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

    const complaint = await Complaint.findOne({
      _id: complaintId,
      owner: ownerId,
    }).populate("student", "user");

    if (!complaint) {
      return res.status(404).json({
        error: "Complaint not found or you don't have permission to delete it.",
      });
    }

    // Notify student the complaint was resolved before deleting
    try {
      const studentUserId = complaint.student?.user;
      if (studentUserId) {
        req.app?.locals?.io
          ?.to(`user:${studentUserId}`)
          .emit("complaint:updated", {
            complaintId: complaint._id,
            subject: complaint.subject,
            status: "Resolved",
          });
      }
    } catch (emitErr) {
      logger.warn("Failed to emit complaint:updated on delete: " + emitErr.message);
    }

    await Complaint.findByIdAndDelete(complaintId);

    logger.info(`Complaint deleted: complaintId=${complaintId}`);

    res.status(200).json({
      message: "Complaint resolved and deleted successfully.",
    });
  } catch (err) {
    logger.error("Error deleting complaint: " + err.message);
    res.status(500).json({ error: "Failed to delete complaint." });
  }
};

module.exports = exports;
