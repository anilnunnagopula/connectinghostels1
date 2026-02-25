/**
 * adminController.js — Platform admin operations
 *
 * All routes are gated behind requireAuth + requireAdmin.
 * Admins are users with role === "admin". Set via DB or a seed script.
 */

const User = require("../models/User");
const Hostel = require("../models/Hostel");
const Student = require("../models/Student");
const Payment = require("../models/Payment");
const Complaint = require("../models/Complaint");
const { invalidateCache } = require("../middleware/cache");
const logger = require("../middleware/logger");

/**
 * GET /api/admin/stats
 * Platform-wide metrics snapshot (includes pending hostel count).
 */
exports.getPlatformStats = async (req, res) => {
  const [totalUsers, totalOwners, totalStudents, totalHostels, pendingHostels, recentPayments] =
    await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      User.countDocuments({ role: "owner" }),
      User.countDocuments({ role: "student" }),
      Hostel.countDocuments({ isActive: true }),
      Hostel.countDocuments({ isActive: false }), // awaiting approval
      Payment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("student", "name email"),
    ]);

  res.json({
    totalUsers,
    totalOwners,
    totalStudents,
    totalHostels,
    pendingHostels,
    recentPayments,
  });
};

/**
 * GET /api/admin/users?role=student&page=1&limit=20
 * Paginated user list, optionally filtered by role.
 */
exports.listUsers = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;
  const filter = req.query.role ? { role: req.query.role } : { role: { $ne: "admin" } };

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -resetPasswordToken -resetPasswordExpires -passwordChangedAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  res.json({
    users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

/**
 * PUT /api/admin/users/:id/ban
 * Toggle ban status on a user. Cannot ban other admins.
 */
exports.banUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.role === "admin") return res.status(403).json({ error: "Cannot ban admins" });

  user.isBanned = !user.isBanned;
  await user.save({ validateBeforeSave: false });

  logger.info(
    `Admin ${req.user.email} ${user.isBanned ? "banned" : "unbanned"} user ${user.email}`,
  );
  res.json({
    message: `User ${user.isBanned ? "banned" : "unbanned"}`,
    isBanned: user.isBanned,
  });
};

// ============================================================================
// HOSTEL MANAGEMENT
// ============================================================================

/**
 * GET /api/admin/hostels?page=1&limit=20&status=pending|active|all
 * Paginated hostel list. Default shows all non-deleted hostels.
 */
exports.listHostels = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  // Admin sees all non-deleted hostels by default; ?status=pending shows only pending
  let filter = { isDeleted: { $ne: true } };
  if (req.query.status === "pending") filter.isActive = false;
  else if (req.query.status === "active") filter.isActive = true;
  // else: all non-deleted (both active and inactive)

  const [hostels, total] = await Promise.all([
    Hostel.find(filter)
      .select("-video")
      .skip(skip)
      .limit(limit)
      .sort({ isActive: 1, createdAt: -1 }) // pending (isActive=false) first
      .populate("ownerId", "name email"),
    Hostel.countDocuments(filter),
  ]);

  res.json({
    hostels,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

/**
 * PUT /api/admin/hostels/:id/approve
 * Approve a pending hostel — sets isActive: true and busts the public cache.
 */
exports.approveHostel = async (req, res) => {
  const hostel = await Hostel.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
  if (!hostel) return res.status(404).json({ error: "Hostel not found" });
  if (hostel.isActive) return res.status(400).json({ error: "Hostel is already active" });

  hostel.isActive = true;
  await hostel.save();

  // Bust the public listing cache so the hostel appears immediately
  await invalidateCache("/api/hostels*");

  // Notify owner by email
  try {
    const { addEmailJob } = require("../queues/emailQueue");
    const owner = await User.findById(hostel.ownerId).select("name email");
    if (addEmailJob && owner) {
      await addEmailJob("hostel-approved", {
        ownerName: owner.name,
        ownerEmail: owner.email,
        hostelName: hostel.name,
      });
    }
  } catch (emailErr) {
    logger.warn("Failed to enqueue hostel-approved email: " + emailErr.message);
  }

  logger.info(`Admin ${req.user.email} approved hostel "${hostel.name}" (${hostel._id})`);
  res.json({ message: "Hostel approved and is now live", hostel });
};

/**
 * PUT /api/admin/hostels/:id/reject
 * Reject a pending hostel — soft-deletes it so the owner can see the rejection
 * in their dashboard and re-submit after fixing issues.
 */
exports.rejectHostel = async (req, res) => {
  const { reason } = req.body;
  const hostel = await Hostel.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
  if (!hostel) return res.status(404).json({ error: "Hostel not found" });
  if (hostel.isActive) return res.status(400).json({ error: "Cannot reject an already-active hostel. Use deactivate instead." });

  hostel.isDeleted = true;
  await hostel.save();

  // Notify owner by email
  try {
    const { addEmailJob } = require("../queues/emailQueue");
    const owner = await User.findById(hostel.ownerId).select("name email");
    if (addEmailJob && owner) {
      await addEmailJob("hostel-rejected", {
        ownerName: owner.name,
        ownerEmail: owner.email,
        hostelName: hostel.name,
        reason: reason || "",
      });
    }
  } catch (emailErr) {
    logger.warn("Failed to enqueue hostel-rejected email: " + emailErr.message);
  }

  logger.info(
    `Admin ${req.user.email} rejected hostel "${hostel.name}" (${hostel._id})${reason ? ` — Reason: ${reason}` : ""}`,
  );
  res.json({ message: "Hostel rejected" });
};

/**
 * DELETE /api/admin/hostels/:id
 * Soft-delete an active hostel.
 */
exports.deleteHostel = async (req, res) => {
  const hostel = await Hostel.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
  if (!hostel) return res.status(404).json({ error: "Hostel not found" });

  hostel.isDeleted = true;
  hostel.isActive = false;
  await hostel.save();

  await invalidateCache("/api/hostels*");

  logger.info(`Admin ${req.user.email} soft-deleted hostel "${hostel.name}" (${hostel._id})`);
  res.json({ message: "Hostel deleted" });
};

/**
 * PUT /api/admin/hostels/:id/verify
 * Mark a hostel as platform-verified (trust badge).
 */
exports.verifyHostel = async (req, res) => {
  const hostel = await Hostel.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
  if (!hostel) return res.status(404).json({ error: "Hostel not found" });

  hostel.isVerified = true;
  await hostel.save();

  await invalidateCache("/api/hostels*");

  logger.info(`Admin ${req.user.email} verified hostel "${hostel.name}" (${hostel._id})`);
  res.json({ message: "Hostel verified", isVerified: true });
};

/**
 * PUT /api/admin/hostels/:id/toggle-active
 * Deactivate or re-activate a hostel without deleting it.
 */
exports.toggleHostelActive = async (req, res) => {
  const hostel = await Hostel.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
  if (!hostel) return res.status(404).json({ error: "Hostel not found" });

  hostel.isActive = !hostel.isActive;
  await hostel.save();

  if (hostel.isActive) await invalidateCache("/api/hostels*");

  logger.info(`Admin ${req.user.email} set hostel "${hostel.name}" isActive=${hostel.isActive}`);
  res.json({
    message: `Hostel ${hostel.isActive ? "activated" : "deactivated"}`,
    isActive: hostel.isActive,
  });
};

// ============================================================================
// COMPLAINT MANAGEMENT
// ============================================================================

/**
 * GET /api/admin/complaints?status=Pending&page=1&limit=20
 * All complaints across the platform, paginated and optionally filtered by status.
 */
exports.listComplaints = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [complaints, total] = await Promise.all([
    Complaint.find(filter)
      .populate("student", "name email phone")
      .populate("hostel", "name address")
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Complaint.countDocuments(filter),
  ]);

  res.json({
    complaints,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

/**
 * PUT /api/admin/complaints/:id/resolve
 * Mark a complaint as Resolved.
 */
exports.resolveComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });
  if (complaint.status === "Resolved") {
    return res.status(400).json({ error: "Complaint already resolved" });
  }

  complaint.status = "Resolved";
  await complaint.save();

  logger.info(`Admin ${req.user.email} resolved complaint ${complaint._id}`);
  res.json({ message: "Complaint resolved", complaint });
};
