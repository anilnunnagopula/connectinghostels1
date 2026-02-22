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
const logger = require("../middleware/logger");

/**
 * GET /api/admin/stats
 * Platform-wide metrics snapshot.
 */
exports.getPlatformStats = async (req, res) => {
  const [totalUsers, totalOwners, totalStudents, totalHostels, recentPayments] =
    await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      User.countDocuments({ role: "owner" }),
      User.countDocuments({ role: "student" }),
      Hostel.countDocuments(),
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

/**
 * GET /api/admin/hostels?page=1&limit=20
 * Paginated hostel list (all hostels, not just active).
 */
exports.listHostels = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const [hostels, total] = await Promise.all([
    Hostel.find()
      .select("-video")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("ownerId", "name email"),
    Hostel.countDocuments(),
  ]);

  res.json({
    hostels,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

/**
 * DELETE /api/admin/hostels/:id
 * Hard-delete a hostel. Logged for audit trail.
 */
exports.deleteHostel = async (req, res) => {
  const hostel = await Hostel.findById(req.params.id);
  if (!hostel) return res.status(404).json({ error: "Hostel not found" });

  await hostel.deleteOne();
  logger.info(
    `Admin ${req.user.email} deleted hostel "${hostel.name}" (${hostel._id})`,
  );
  res.json({ message: "Hostel deleted" });
};

/**
 * PUT /api/admin/hostels/:id/toggle-active
 * Deactivate or re-activate a hostel without deleting it.
 */
exports.toggleHostelActive = async (req, res) => {
  const hostel = await Hostel.findById(req.params.id);
  if (!hostel) return res.status(404).json({ error: "Hostel not found" });

  hostel.isActive = !hostel.isActive;
  await hostel.save();

  logger.info(
    `Admin ${req.user.email} set hostel "${hostel.name}" isActive=${hostel.isActive}`,
  );
  res.json({ message: `Hostel ${hostel.isActive ? "activated" : "deactivated"}`, isActive: hostel.isActive });
};
