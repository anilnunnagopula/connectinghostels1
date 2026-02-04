/**
 * notificationController.js - Student Notification Management
 *
 * Features:
 * - Get all notifications for student
 * - Mark single notification as read
 * - Mark all notifications as read
 * - Clear all notifications
 * - Get unread count
 *
 * Routes:
 * GET    /api/student/notifications          - Get all notifications
 * PATCH  /api/student/notifications/:id/read - Mark as read
 * PATCH  /api/student/notifications/mark-all-read - Mark all as read
 * DELETE /api/student/notifications/clear-all - Clear all
 * GET    /api/student/notifications/unread-count - Get unread count
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
    const studentId = req.user.id; // Assuming student ID from auth token

    // Optional query parameters for filtering
    const { type, isRead, limit = 50, page = 1 } = req.query;

    // Build query
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
    const studentId = req.user.id;
    const notificationId = req.params.id;

    // Find notification and verify it belongs to this student
    const notification = await Notification.findOne({
      _id: notificationId,
      recipientStudent: studentId,
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
    const studentId = req.user.id;

    // Update all unread notifications for this student
    const result = await Notification.updateMany(
      {
        recipientStudent: studentId,
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
    const studentId = req.user.id;

    // Delete all notifications for this student
    const result = await Notification.deleteMany({
      recipientStudent: studentId,
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
    const studentId = req.user.id;

    const count = await Notification.countDocuments({
      recipientStudent: studentId,
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
    const studentId = req.user.id;
    const notificationId = req.params.id;

    // Find and delete notification
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipientStudent: studentId,
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

/**
 * ============================================================================
 * USAGE IN ROUTES FILE
 * ============================================================================
 *
 * // routes/studentRoutes.js or routes/notificationRoutes.js
 *
 * const express = require("express");
 * const router = express.Router();
 * const { protect, authorizeStudent } = require("../middleware/auth");
 * const notificationController = require("../controllers/notificationController");
 *
 * // All routes require authentication and student role
 * router.use(protect);
 * router.use(authorizeStudent);
 *
 * // Student notification routes
 * router.get("/notifications", notificationController.getStudentNotifications);
 * router.get("/notifications/unread-count", notificationController.getUnreadCount);
 * router.patch("/notifications/:id/read", notificationController.markAsRead);
 * router.patch("/notifications/mark-all-read", notificationController.markAllAsRead);
 * router.delete("/notifications/:id", notificationController.deleteNotification);
 * router.delete("/notifications/clear-all", notificationController.clearAll);
 *
 * module.exports = router;
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * TESTING CHECKLIST
 * ============================================================================
 *
 * GET /api/student/notifications
 * [ ] Returns all notifications for student
 * [ ] Sorted by most recent first
 * [ ] Pagination works
 * [ ] Filtering by type works
 * [ ] Filtering by isRead works
 * [ ] Populates hostel and sender info
 *
 * PATCH /api/student/notifications/:id/read
 * [ ] Marks notification as read
 * [ ] Sets readAt timestamp
 * [ ] Returns 404 if not found
 * [ ] Verifies notification belongs to student
 *
 * PATCH /api/student/notifications/mark-all-read
 * [ ] Marks all unread as read
 * [ ] Returns count of marked notifications
 * [ ] Only affects current student's notifications
 *
 * DELETE /api/student/notifications/clear-all
 * [ ] Deletes all student's notifications
 * [ ] Returns count of deleted notifications
 * [ ] Only affects current student's notifications
 *
 * GET /api/student/notifications/unread-count
 * [ ] Returns accurate unread count
 * [ ] Only counts current student's notifications
 *
 * DELETE /api/student/notifications/:id
 * [ ] Deletes single notification
 * [ ] Returns 404 if not found
 * [ ] Verifies notification belongs to student
 *
 * AUTHORIZATION:
 * [ ] Requires authentication token
 * [ ] Only students can access
 * [ ] Student can only see their own notifications
 *
 * ============================================================================
 */
