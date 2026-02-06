/**
 * alertController.js - Handle Owner Alerts to Students
 *
 * Features:
 * - Send alerts to selected students
 * - Save notifications to database
 * - Support for different notification types
 * - Integration with SMS/WhatsApp (optional)
 * - Bulk notification creation
 *
 * Routes:
 * POST /api/alerts/send - Send alerts to students
 */

/**
 * alertController.js - SECURE Owner Alert System
 *
 * SECURITY FIXES:
 * - Uses Student._id instead of phone numbers
 * - Verifies ownership (student.owner === ownerId)
 * - Only sends to "Active" students
 * - Prevents cross-owner alerts
 *
 * Features:
 * - Send alerts to selected students
 * - Save notifications to database
 * - Support for different notification types
 * - Bulk notification creation
 */

const Notification = require("../models/Notification");
const Student = require("../models/Student");
const User = require("../models/User");

/**
 * @desc    Send alerts to selected students (SECURE VERSION)
 * @route   POST /api/alerts/send
 * @access  Private (Owner only)
 */
exports.sendAlerts = async (req, res) => {
  try {
    const { studentIds, message, type } = req.body;
    const ownerId = req.user.id; // Get owner from auth token

    console.log("📨 Alert request:", {
      ownerId,
      studentCount: studentIds?.length,
      type,
    });

    // ========================================================================
    // VALIDATION
    // ========================================================================
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

    // ========================================================================
    // SECURITY: FIND STUDENTS BY ID AND VERIFY OWNERSHIP
    // ========================================================================
    const students = await Student.find({
      _id: { $in: studentIds },
      owner: ownerId, // ✅ CRITICAL: Only owner's students
      status: "Active", // ✅ CRITICAL: Only active students
    }).select("_id name email currentHostel");

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active students found. Students must be admitted first.",
      });
    }

    console.log(`✅ Verified ${students.length} students belong to owner`);

    // ========================================================================
    // DETERMINE NOTIFICATION TYPE
    // ========================================================================
    const validTypes = ["alert", "info", "success", "fee", "holiday", "welcome", "others"];
    const notificationType = validTypes.includes(type) ? type : "info";

    // ========================================================================
    // CREATE NOTIFICATIONS IN DATABASE
    // ========================================================================
    const notifications = students.map((student) => ({
      recipientStudent: student._id,
      recipientHostel: student.currentHostel,
      sender: ownerId,
      senderRole: "owner",
      message: message.trim(),
      type: notificationType,
      isRead: false,
    }));

    // Bulk insert notifications
    const createdNotifications = await Notification.insertMany(notifications);

    console.log(`✅ Alert sent from Owner: ${ownerId}`);
    console.log(`📱 Recipients: ${students.length} student(s)`);
    console.log(`💬 Message: ${message.substring(0, 50)}...`);
    console.log(`📊 Notifications created: ${createdNotifications.length}`);

    // ========================================================================
    // RESPONSE
    // ========================================================================
    res.status(200).json({
      success: true,
      message: `Alerts sent successfully to ${students.length} student(s).`,
      data: {
        sentTo: students.length,
        notificationsCreated: createdNotifications.length,
        recipients: students.map(s => ({ id: s._id, name: s.name })),
      },
    });
  } catch (err) {
    console.error("❌ Error sending alerts:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send alerts.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * @desc    Get all alerts sent by owner
 * @route   GET /api/alerts/history
 * @access  Private (Owner only)
 */
exports.getAlertHistory = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { limit = 50, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const alerts = await Notification.find({ sender: ownerId })
      .populate("recipientStudent", "name email")
      .populate("recipientHostel", "name")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Notification.countDocuments({ sender: ownerId });

    res.status(200).json({
      success: true,
      count: alerts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: alerts,
    });
  } catch (err) {
    console.error("❌ Error fetching alert history:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch alert history.",
      error: err.message,
    });
  }
};

module.exports = exports;
// ============================================================================
// OPTIONAL: SMS/WHATSAPP INTEGRATION
// ============================================================================

/**
 * Sends SMS alerts using Twilio (example)
 * Uncomment and configure when ready
 */
/*
const twilio = require("twilio");
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMSAlerts(phoneNumbers, message) {
  const promises = phoneNumbers.map((phone) =>
    client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    })
  );

  try {
    await Promise.all(promises);
    console.log("✅ SMS alerts sent successfully");
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
  }
}
*/

/**
 * Sends WhatsApp messages using Twilio (example)
 * Uncomment and configure when ready
 */
/*
async function sendWhatsAppAlerts(phoneNumbers, message) {
  const promises = phoneNumbers.map((phone) =>
    client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phone}`,
    })
  );

  try {
    await Promise.all(promises);
    console.log("✅ WhatsApp alerts sent successfully");
  } catch (error) {
    console.error("❌ Error sending WhatsApp:", error);
  }
}
*/

module.exports = exports;

/**
 * ============================================================================
 * NOTIFICATION MODEL SCHEMA (Create this file: models/Notification.js)
 * ============================================================================
 *
 * const mongoose = require("mongoose");
 *
 * const notificationSchema = new mongoose.Schema(
 *   {
 *     recipientStudent: {
 *       type: mongoose.Schema.Types.ObjectId,
 *       ref: "Student",
 *       required: true,
 *       index: true, // Index for faster queries
 *     },
 *     recipientHostel: {
 *       type: mongoose.Schema.Types.ObjectId,
 *       ref: "Hostel",
 *       index: true,
 *     },
 *     sender: {
 *       type: mongoose.Schema.Types.ObjectId,
 *       ref: "User",
 *     },
 *     senderRole: {
 *       type: String,
 *       enum: ["owner", "admin", "system"],
 *       default: "owner",
 *     },
 *     message: {
 *       type: String,
 *       required: true,
 *       trim: true,
 *     },
 *     type: {
 *       type: String,
 *       enum: ["alert", "info", "success", "fee", "holiday", "welcome", "others"],
 *       default: "info",
 *     },
 *     isRead: {
 *       type: Boolean,
 *       default: false,
 *       index: true, // Index for faster unread queries
 *     },
 *     readAt: {
 *       type: Date,
 *     },
 *   },
 *   {
 *     timestamps: true, // Adds createdAt and updatedAt
 *   }
 * );
 *
 * // Compound index for efficient queries
 * notificationSchema.index({ recipientStudent: 1, createdAt: -1 });
 * notificationSchema.index({ recipientStudent: 1, isRead: 1 });
 *
 * module.exports = mongoose.model("Notification", notificationSchema);
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * STUDENT NOTIFICATION ROUTES (Create these in your routes file)
 * ============================================================================
 *
 * // routes/studentRoutes.js or routes/notificationRoutes.js
 *
 * const express = require("express");
 * const router = express.Router();
 * const { protect, authorizeStudent } = require("../middleware/auth");
 * const notificationController = require("../controllers/notificationController");
 *
 * // Student notification routes
 * router.get(
 *   "/notifications",
 *   protect,
 *   authorizeStudent,
 *   notificationController.getStudentNotifications
 * );
 *
 * router.patch(
 *   "/notifications/:id/read",
 *   protect,
 *   authorizeStudent,
 *   notificationController.markAsRead
 * );
 *
 * router.patch(
 *   "/notifications/mark-all-read",
 *   protect,
 *   authorizeStudent,
 *   notificationController.markAllAsRead
 * );
 *
 * router.delete(
 *   "/notifications/clear-all",
 *   protect,
 *   authorizeStudent,
 *   notificationController.clearAll
 * );
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
 * [ ] Owner can send alerts to selected students
 * [ ] Notifications saved to database
 * [ ] Correct notification type set
 * [ ] Students receive notifications
 * [ ] Phone number validation works
 * [ ] Bulk insert successful
 * [ ] Error handling works
 * [ ] Console logs show correct info
 *
 * OPTIONAL (when SMS enabled):
 * [ ] SMS sent successfully
 * [ ] WhatsApp messages sent
 * [ ] Twilio integration works
 *
 * ============================================================================
 */
