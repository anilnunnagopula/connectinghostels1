const Notification = require("../models/Notification");
const Student = require("../models/Student");
const logger = require("../middleware/logger");

/**
 * @desc    Get all notifications for logged-in student (paginated)
 * @route   GET /api/student/notifications?page=1&limit=20
 * @access  Private (Student only)
 */
exports.getStudentNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found. Please complete your profile first.",
      });
    }

    const { type, isRead } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const query = { recipientStudent: student._id };
    if (type && type !== "all") query.type = type;
    if (isRead !== undefined) query.isRead = isRead === "true";

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .populate("recipientHostel", "name location")
        .populate("sender", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      notifications,
    });
  } catch (err) {
    logger.error("Error fetching notifications: " + err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
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

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found." });
    }

    const notification = await Notification.findOne({
      _id: notificationId,
      recipientStudent: student._id,
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({ success: true, message: "Notification marked as read.", data: notification });
  } catch (err) {
    logger.error("Error marking notification as read: " + err.message);
    res.status(500).json({ success: false, message: "Failed to mark notification as read." });
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

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found." });
    }

    const result = await Notification.updateMany(
      { recipientStudent: student._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } },
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notification(s) marked as read.`,
      data: { markedCount: result.modifiedCount },
    });
  } catch (err) {
    logger.error("Error marking all notifications as read: " + err.message);
    res.status(500).json({ success: false, message: "Failed to mark all notifications as read." });
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

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found." });
    }

    const result = await Notification.deleteMany({ recipientStudent: student._id });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notification(s) cleared.`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (err) {
    logger.error("Error clearing notifications: " + err.message);
    res.status(500).json({ success: false, message: "Failed to clear notifications." });
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

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(200).json({ success: true, count: 0 });
    }

    const count = await Notification.countDocuments({
      recipientStudent: student._id,
      isRead: false,
    });

    res.status(200).json({ success: true, count });
  } catch (err) {
    logger.error("Error getting unread count: " + err.message);
    res.status(500).json({ success: false, message: "Failed to get unread count." });
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

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found." });
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipientStudent: student._id,
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    res.status(200).json({ success: true, message: "Notification deleted successfully." });
  } catch (err) {
    logger.error("Error deleting notification: " + err.message);
    res.status(500).json({ success: false, message: "Failed to delete notification." });
  }
};

module.exports = exports;
