const Notification = require("../models/Notification");
const Student = require("../models/Student");
const logger = require("../middleware/logger");

/**
 * @desc    Send alerts to selected students (owner only)
 * @route   POST /api/alerts/send
 * @access  Private (Owner only)
 */
exports.sendAlerts = async (req, res) => {
  try {
    const { studentIds, message, type } = req.body;
    const ownerId = req.user.id;

    if (!studentIds || studentIds.length === 0 || !message) {
      return res.status(400).json({
        success: false,
        message: "Student IDs and message are required.",
      });
    }

    if (message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 5 characters long.",
      });
    }

    // Verify ownership and active status
    const students = await Student.find({
      _id: { $in: studentIds },
      owner: ownerId,
      status: "Active",
    }).select("_id name email currentHostel user");

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active students found. Students must be admitted first.",
      });
    }

    const validTypes = ["alert", "info", "success", "fee", "holiday", "welcome", "others"];
    const notificationType = validTypes.includes(type) ? type : "info";

    const notifications = students.map((student) => ({
      recipientStudent: student._id,
      recipientHostel: student.currentHostel,
      sender: ownerId,
      senderRole: "owner",
      message: message.trim(),
      type: notificationType,
      isRead: false,
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    // Emit real-time socket notification to each student
    const io = req.app?.locals?.io;
    if (io) {
      for (const student of students) {
        if (student.user) {
          const unreadCount = await Notification.countDocuments({
            recipientStudent: student._id,
            isRead: false,
          });
          io.to(`user:${student.user}`).emit("notification:new", { unreadCount });
        }
      }
    }

    logger.info(`Alerts sent by owner=${ownerId} to ${students.length} student(s)`);

    res.status(200).json({
      success: true,
      message: `Alerts sent successfully to ${students.length} student(s).`,
      data: {
        sentTo: students.length,
        notificationsCreated: createdNotifications.length,
        recipients: students.map((s) => ({ id: s._id, name: s.name })),
      },
    });
  } catch (err) {
    logger.error("Error sending alerts: " + err.message);
    res.status(500).json({
      success: false,
      message: "Failed to send alerts.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * @desc    Get all alerts sent by owner (paginated)
 * @route   GET /api/alerts/history?page=1&limit=20
 * @access  Private (Owner only)
 */
exports.getAlertHistory = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = { sender: ownerId };

    const [alerts, total] = await Promise.all([
      Notification.find(filter)
        .populate("recipientStudent", "name email")
        .populate("recipientHostel", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: alerts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: alerts,
    });
  } catch (err) {
    logger.error("Error fetching alert history: " + err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch alert history.",
    });
  }
};

module.exports = exports;
