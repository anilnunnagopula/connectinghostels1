/**
 * FIXED notificationController.js - Replace ALL exports in your existing file
 *
 * KEY FIX: All functions now properly convert User._id → Student._id
 */

const Notification = require("../models/Notification");
const Student = require("../models/Student");

/**
 * @desc    Get all notifications for logged-in student
 * @route   GET /api/student/notifications
 * @access  Private (Student only)
 */
exports.getStudentNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // This is User._id from auth token

    console.log(`📍 Fetching notifications for user: ${userId}`);

    // ✅ CRITICAL FIX: Find the Student document first
    const student = await Student.findOne({ user: userId });

    if (!student) {
      console.log("❌ No student profile found for user:", userId);
      return res.status(404).json({
        success: false,
        message:
          "Student profile not found. Please complete your profile first.",
      });
    }

    const studentId = student._id; // ✅ NOW we have the correct Student._id
    console.log(`✅ Found student: ${studentId} (${student.name})`);

    // Optional query parameters for filtering
    const { type, isRead, limit = 50, page = 1 } = req.query;

    // Build query using Student._id
    const query = { recipientStudent: studentId };

    if (type && type !== "all") {
      query.type = type;
    }

    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch notifications
    const notifications = await Notification.find(query)
      .populate("recipientHostel", "name location")
      .populate("sender", "name")
      .sort({ createdAt: -1 }) // Most recent first
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Notification.countDocuments(query);

    console.log(
      `✅ Found ${notifications.length} notifications (${total} total)`,
    );

    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      notifications,
    });
  } catch (err) {
    console.error("❌ Error fetching notifications:", err);
    console.error("Full error:", err.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
      error: err.message,
    });
  }
};

/**
 * @desc    Mark a single notification as read
 * @route   PATCH /api/student/notifications/:id/read
 * @access  Private (Student only)
 */
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    // ✅ FIX: Get Student._id first
    const student = await Student.findOne({ user: userId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    const studentId = student._id;

    // Find notification and verify it belongs to this student
    const notification = await Notification.findOne({
      _id: notificationId,
      recipientStudent: studentId, // ✅ Now using correct Student._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    // Update isRead status
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });
  } catch (err) {
    console.error("❌ Error marking notification as read:", err);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read.",
      error: err.message,
    });
  }
};

/**
 * @desc    Mark all notifications as read for student
 * @route   PATCH /api/student/notifications/mark-all-read
 * @access  Private (Student only)
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ FIX: Get Student._id first
    const student = await Student.findOne({ user: userId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    const studentId = student._id;

    // Update all unread notifications for this student
    const result = await Notification.updateMany(
      {
        recipientStudent: studentId, // ✅ Now using correct Student._id
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notification(s) marked as read.`,
      data: {
        markedCount: result.modifiedCount,
      },
    });
  } catch (err) {
    console.error("❌ Error marking all as read:", err);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read.",
      error: err.message,
    });
  }
};

/**
 * @desc    Clear all notifications for student
 * @route   DELETE /api/student/notifications/clear-all
 * @access  Private (Student only)
 */
exports.clearAll = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ FIX: Get Student._id first
    const student = await Student.findOne({ user: userId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    const studentId = student._id;

    // Delete all notifications for this student
    const result = await Notification.deleteMany({
      recipientStudent: studentId, // ✅ Now using correct Student._id
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notification(s) cleared.`,
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (err) {
    console.error("❌ Error clearing notifications:", err);
    res.status(500).json({
      success: false,
      message: "Failed to clear notifications.",
      error: err.message,
    });
  }
};

/**
 * @desc    Get unread notification count
 * @route   GET /api/student/notifications/unread-count
 * @access  Private (Student only)
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ FIX: Get Student._id first
    const student = await Student.findOne({ user: userId });

    if (!student) {
      return res.status(200).json({
        success: true,
        count: 0, // Return 0 if no student profile
      });
    }

    const studentId = student._id;

    const count = await Notification.countDocuments({
      recipientStudent: studentId, // ✅ Now using correct Student._id
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (err) {
    console.error("❌ Error getting unread count:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get unread count.",
      error: err.message,
    });
  }
};

/**
 * @desc    Delete a single notification
 * @route   DELETE /api/student/notifications/:id
 * @access  Private (Student only)
 */
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    // ✅ FIX: Get Student._id first
    const student = await Student.findOne({ user: userId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    const studentId = student._id;

    // Find and delete notification
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipientStudent: studentId, // ✅ Now using correct Student._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Error deleting notification:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification.",
      error: err.message,
    });
  }
};

module.exports = exports;
