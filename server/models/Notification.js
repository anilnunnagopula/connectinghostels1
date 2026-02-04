/**
 * Notification.js - Notification Model Schema
 *
 * Purpose:
 * - Store notifications sent from owners to students
 * - Track read/unread status
 * - Support different notification types
 * - Enable efficient querying with indexes
 */

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // ========================================================================
    // RECIPIENT INFORMATION
    // ========================================================================
    recipientStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true, // Index for faster queries by student
    },
    recipientHostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      index: true, // Index for querying by hostel
    },

    // ========================================================================
    // SENDER INFORMATION
    // ========================================================================
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the owner/admin who sent it
    },
    senderRole: {
      type: String,
      enum: ["owner", "admin", "system"],
      default: "owner",
    },

    // ========================================================================
    // NOTIFICATION CONTENT
    // ========================================================================
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    type: {
      type: String,
      enum: [
        "alert", // General alerts (yellow megaphone)
        "info", // Informational messages (blue bell)
        "success", // Success messages (green check)
        "fee", // Fee-related (orange info)
        "holiday", // Holiday notices (purple megaphone)
        "welcome", // Welcome messages (green check)
        "others", // Other miscellaneous
      ],
      default: "info",
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    // ========================================================================
    // READ STATUS
    // ========================================================================
    isRead: {
      type: Boolean,
      default: false,
      index: true, // Index for faster unread queries
    },
    readAt: {
      type: Date,
    },

    // ========================================================================
    // METADATA (Optional)
    // ========================================================================
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    expiresAt: {
      type: Date, // Optional: Auto-delete after this date
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// ============================================================================
// INDEXES FOR PERFORMANCE
// ============================================================================

// Compound index for efficient queries
notificationSchema.index({ recipientStudent: 1, createdAt: -1 });
notificationSchema.index({ recipientStudent: 1, isRead: 1 });
notificationSchema.index({ recipientHostel: 1, createdAt: -1 });

// Index for expired notification cleanup (if using expiresAt)
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ============================================================================
// VIRTUAL PROPERTIES
// ============================================================================

// Virtual for getting time since notification was created
notificationSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const created = this.createdAt;
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return created.toLocaleDateString();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Mark notification as read
 */
notificationSchema.methods.markAsRead = async function () {
  this.isRead = true;
  this.readAt = new Date();
  return await this.save();
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Get unread count for a student
 */
notificationSchema.statics.getUnreadCount = async function (studentId) {
  return await this.countDocuments({
    recipientStudent: studentId,
    isRead: false,
  });
};

/**
 * Get recent notifications for a student
 */
notificationSchema.statics.getRecentForStudent = async function (
  studentId,
  limit = 20,
) {
  return await this.find({ recipientStudent: studentId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("recipientHostel", "name location")
    .populate("sender", "name");
};

/**
 * Mark all as read for a student
 */
notificationSchema.statics.markAllAsReadForStudent = async function (
  studentId,
) {
  return await this.updateMany(
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
};

/**
 * Clear all notifications for a student
 */
notificationSchema.statics.clearAllForStudent = async function (studentId) {
  return await this.deleteMany({ recipientStudent: studentId });
};

// ============================================================================
// MIDDLEWARE (Hooks)
// ============================================================================

// Pre-save middleware to ensure readAt is set when isRead becomes true
notificationSchema.pre("save", function (next) {
  if (this.isModified("isRead") && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

// ============================================================================
// EXPORT MODEL
// ============================================================================

module.exports = mongoose.model("Notification", notificationSchema);

/**
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 *
 * // Create a notification
 * const notification = await Notification.create({
 *   recipientStudent: studentId,
 *   recipientHostel: hostelId,
 *   sender: ownerId,
 *   senderRole: "owner",
 *   message: "Mess will be closed tomorrow",
 *   type: "alert",
 * });
 *
 * // Get unread count
 * const unreadCount = await Notification.getUnreadCount(studentId);
 *
 * // Get recent notifications
 * const recent = await Notification.getRecentForStudent(studentId, 20);
 *
 * // Mark single as read
 * await notification.markAsRead();
 *
 * // Mark all as read
 * await Notification.markAllAsReadForStudent(studentId);
 *
 * // Clear all
 * await Notification.clearAllForStudent(studentId);
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * MIGRATION SCRIPT (If you have existing data)
 * ============================================================================
 *
 * // Run this once to add notification support to existing system
 *
 * const mongoose = require("mongoose");
 * const Notification = require("./models/Notification");
 *
 * async function migrateNotifications() {
 *   // Connect to database
 *   await mongoose.connect(process.env.MONGO_URI);
 *
 *   // Create indexes
 *   await Notification.createIndexes();
 *
 *   console.log("✅ Notification indexes created");
 *
 *   // Close connection
 *   await mongoose.connection.close();
 * }
 *
 * migrateNotifications();
 *
 * ============================================================================
 */
