/**
 * notificationRoutes.js - Complete Notification Routes
 *
 * Routes:
 * - Owner routes (send alerts)
 * - Student routes (view, mark as read, clear)
 */

/**
 * notificationRoutes.js - Complete Notification Routes
 *
 * Routes:
 * - Owner routes (send alerts)
 * - Student routes (view, mark as read, clear)
 */

const express = require("express");
const router = express.Router();

// Controllers
const alertController = require("../controllers/alertController");
const notificationController = require("../controllers/notificationController");

// Middleware (adjust path based on your project structure)
const {
  requireAuth,
  requireOwner,
  requireStudent,
} = require("../middleware/authMiddleware");

// ============================================================================
// OWNER ROUTES - Send Alerts to Students
// ============================================================================

/**
 * @route   POST /api/alerts/send
 * @desc    Send alerts to selected students
 * @access  Private (Owner only)
 */
router.post(
  "/alerts/send",
  requireAuth,
  requireOwner,
  alertController.sendAlerts,
);

/**
 * @route   GET /api/alerts/history
 * @desc    Get alert history for owner
 * @access  Private (Owner only)
 */
router.get(
  "/alerts/history",
  requireAuth,
  requireOwner,
  alertController.getAlertHistory,
);

// ============================================================================
// STUDENT ROUTES - Manage Notifications
// ============================================================================

/**
 * @route   GET /api/student/notifications
 * @desc    Get all notifications for student
 * @access  Private (Student only)
 * @query   ?type=alert&isRead=false&limit=20&page=1
 */
router.get(
  "/student/notifications",
  requireAuth,
  requireStudent,
  notificationController.getStudentNotifications,
);

/**
 * @route   GET /api/student/notifications/unread-count
 * @desc    Get unread notification count
 * @access  Private (Student only)
 */
router.get(
  "/student/notifications/unread-count",
  requireAuth,
  requireStudent,
  notificationController.getUnreadCount,
);

/**
 * @route   PATCH /api/student/notifications/:id/read
 * @desc    Mark single notification as read
 * @access  Private (Student only)
 */
router.patch(
  "/student/notifications/:id/read",
  requireAuth,
  requireStudent,
  notificationController.markAsRead,
);

/**
 * @route   PATCH /api/student/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private (Student only)
 */
router.patch(
  "/student/notifications/mark-all-read",
  requireAuth,
  requireStudent,
  notificationController.markAllAsRead,
);

/**
 * @route   DELETE /api/student/notifications/:id
 * @desc    Delete single notification
 * @access  Private (Student only)
 */
router.delete(
  "/student/notifications/:id",
  requireAuth,
  requireStudent,
  notificationController.deleteNotification,
);

/**
 * @route   DELETE /api/student/notifications/clear-all
 * @desc    Clear all notifications
 * @access  Private (Student only)
 */
router.delete(
  "/student/notifications/clear-all",
  requireAuth,
  requireStudent,
  notificationController.clearAll,
);

module.exports = router;
/**
 * ============================================================================
 * ADD TO YOUR MAIN APP.JS / SERVER.JS
 * ============================================================================
 *
 * const notificationRoutes = require("./routes/notificationRoutes");
 *
 * // Mount routes
 * app.use("/api", notificationRoutes);
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * EXAMPLE AUTH MIDDLEWARE (If you don't have it)
 * ============================================================================
 *
 * // middleware/auth.js
 *
 * const jwt = require("jsonwebtoken");
 * const User = require("../models/User");
 *
 * // Protect routes - verify JWT token
 * exports.protect = async (req, res, next) => {
 *   try {
 *     let token;
 *
 *     if (req.headers.authorization?.startsWith("Bearer")) {
 *       token = req.headers.authorization.split(" ")[1];
 *     }
 *
 *     if (!token) {
 *       return res.status(401).json({ message: "Not authorized" });
 *     }
 *
 *     const decoded = jwt.verify(token, process.env.JWT_SECRET);
 *     req.user = await User.findById(decoded.id).select("-password");
 *
 *     next();
 *   } catch (error) {
 *     res.status(401).json({ message: "Not authorized" });
 *   }
 * };
 *
 * // Authorize owner
 * exports.authorizeOwner = (req, res, next) => {
 *   if (req.user.role !== "owner") {
 *     return res.status(403).json({ message: "Access denied. Owner only." });
 *   }
 *   next();
 * };
 *
 * // Authorize student
 * exports.authorizeStudent = (req, res, next) => {
 *   if (req.user.role !== "student") {
 *     return res.status(403).json({ message: "Access denied. Student only." });
 *   }
 *   next();
 * };
 *
 * ============================================================================
 */
