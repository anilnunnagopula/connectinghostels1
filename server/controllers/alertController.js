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

const Notification = require("../models/Notification"); // You need to create this model
const Student = require("../models/Student"); // Assuming you have a Student model
const User = require("../models/User");

/**
 * @desc    Send alerts to selected students
 * @route   POST /api/alerts/send
 * @access  Private (Owner only)
 */
exports.sendAlerts = async (req, res) => {
  try {
    const { phoneNumbers, message, type, hostelId } = req.body;
    const ownerId = req.user.id; // Get owner from auth token

    // ========================================================================
    // VALIDATION
    // ========================================================================
    if (!phoneNumbers || phoneNumbers.length === 0 || !message) {
      return res.status(400).json({
        success: false,
        message: "Phone numbers and message are required.",
      });
    }

    // ========================================================================
    // FIND STUDENTS BY PHONE NUMBERS
    // ========================================================================
    const students = await Student.find({
      phone: { $in: phoneNumbers },
    }).select("_id name phone hostel");

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found with the provided phone numbers.",
      });
    }

    // ========================================================================
    // DETERMINE NOTIFICATION TYPE
    // ========================================================================
    // Map message types from frontend to notification types
    const notificationType = type || "info"; // Default to 'info'
    // Possible types: 'alert', 'info', 'success', 'fee', 'holiday', 'welcome'

    // ========================================================================
    // CREATE NOTIFICATIONS IN DATABASE
    // ========================================================================
    const notifications = students.map((student) => ({
      recipientStudent: student._id,
      recipientHostel: hostelId || student.hostel, // Use provided hostelId or student's current hostel
      sender: ownerId,
      senderRole: "owner",
      message: message.trim(),
      type: notificationType,
      isRead: false,
      createdAt: new Date(),
    }));

    // Bulk insert notifications
    const createdNotifications = await Notification.insertMany(notifications);

    console.log(`✅ Alert sent from Owner: ${ownerId}`);
    console.log(`📱 Recipients: ${phoneNumbers.length} student(s)`);
    console.log(`💬 Message: ${message.substring(0, 50)}...`);
    console.log(`📊 Notifications created: ${createdNotifications.length}`);

    // ========================================================================
    // OPTIONAL: SEND SMS/WHATSAPP (Using Twilio or other service)
    // ========================================================================
    // Uncomment and configure when ready to use SMS/WhatsApp
    /*
    if (process.env.ENABLE_SMS === "true") {
      await sendSMSAlerts(phoneNumbers, message);
    }
    */

    // ========================================================================
    // RESPONSE
    // ========================================================================
    res.status(200).json({
      success: true,
      message: `Alerts sent successfully to ${students.length} student(s).`,
      data: {
        sentTo: students.length,
        notificationsCreated: createdNotifications.length,
      },
    });
  } catch (err) {
    console.error("❌ Error sending alerts:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send alerts.",
      error: err.message,
    });
  }
};

/**
 * @desc    Get all alerts sent by owner (optional - for owner's history)
 * @route   GET /api/alerts/history
 * @access  Private (Owner only)
 */
exports.getAlertHistory = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const alerts = await Notification.find({ sender: ownerId })
      .populate("recipientStudent", "name phone")
      .populate("recipientHostel", "name")
      .sort({ createdAt: -1 })
      .limit(50); // Last 50 alerts

    res.status(200).json({
      success: true,
      count: alerts.length,
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
