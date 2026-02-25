const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const Booking = require("../models/Booking");  // Phase 1: was StudentHostel
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const Payment = require("../models/Payment");
const Due = require("../models/Due");
const User = require("../models/User");
const logger = require("../middleware/logger");

exports.addStudent = async (req, res) => {
  try {
    const { hostel, floor, room, email, name, phone } = req.body;
    const ownerId = req.user.id;

    if (!hostel || !room) {
      return res.status(400).json({ message: "hostel and room fields are required." });
    }
    if (!email) {
      return res.status(400).json({ message: "Student email is required." });
    }

    // 1. Look up User by email — or auto-create one for walk-in students
    let userDoc = await User.findOne({ email: email.trim().toLowerCase() });
    let wasAutoCreated = false;

    if (!userDoc) {
      // Walk-in student: auto-create a User account with a random temp password
      if (!name) {
        return res.status(400).json({ message: "Student name is required to create their account." });
      }
      const bcrypt = require("bcryptjs");
      const crypto = require("crypto");
      const tempPassword = crypto.randomBytes(12).toString("hex"); // 24-char temp password
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      userDoc = new User({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone || "",
        role: "student",
        password: hashedPassword,
        authProvider: "local",
        profileCompleted: true,
      });
      await userDoc.save();
      wasAutoCreated = true;
    } else if (userDoc.role && userDoc.role !== "student") {
      // Block enrolling Owner or Admin accounts as students — prevents cross-role abuse
      return res.status(400).json({
        message: `This email belongs to an ${userDoc.role} account and cannot be enrolled as a student.`,
      });
    }

    // 2. Check if this user already has a student profile
    const existingStudent = await Student.findOne({ user: userDoc._id });
    if (existingStudent) {
      return res.status(409).json({
        message: `${userDoc.name || email} already has a student profile in the system.`,
      });
    }

    // 3. Check Hostel Availability
    const hostelDoc = await Hostel.findOne({ _id: hostel, ownerId });
    if (!hostelDoc) {
      return res.status(404).json({ message: "Hostel not found or you don't own it." });
    }
    if (hostelDoc.availableRooms <= 0) {
      return res.status(400).json({ message: "No available rooms in this hostel." });
    }

    // 4. Create Student placement record
    const newStudent = new Student({
      user: userDoc._id,
      currentHostel: hostel,
      currentOwner: ownerId,
      roomNumber: String(room),
      floor,
      status: "Active",
    });

    await newStudent.save();

    // 5. Decrement Available Rooms
    hostelDoc.availableRooms = Math.max(0, hostelDoc.availableRooms - 1);
    await hostelDoc.save();

    try {
      req.app?.locals?.io
        ?.to(`hostel:${hostel}`)
        .emit("room:availability_changed", {
          hostelId: hostel,
          availableRooms: hostelDoc.availableRooms,
        });
    } catch { /* non-critical */ }

    res.status(201).json({
      message: `${userDoc.name || email} enrolled successfully.${wasAutoCreated ? " A new account was created — they can log in using their email and reset their password." : ""}`,
      student: newStudent,
      accountCreated: wasAutoCreated,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "This student is already enrolled." });
    }
    logger.error("Error adding student: " + err.message);
    res.status(500).json({ message: "Failed to add student." });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const ownerId = req.user.id;

    const student = await Student.findOne({ _id: studentId, currentOwner: ownerId });
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // 1. Increment Available Rooms
    if (student.hostel) {
      const hostelDoc = await Hostel.findById(student.hostel);
      if (hostelDoc) {
        if (hostelDoc.availableRooms < hostelDoc.totalRooms) {
          hostelDoc.availableRooms += 1;
          await hostelDoc.save();
        }
      }
    }

    // 2. Soft-delete Student
    student.isDeleted = true;
    await student.save();

    // Broadcast availability change after vacate
    if (student.hostel) {
      try {
        const updatedHostel = await Hostel.findById(student.hostel).select("availableRooms");
        req.app?.locals?.io
          ?.to(`hostel:${student.hostel}`)
          .emit("room:availability_changed", {
            hostelId: student.hostel,
            availableRooms: updatedHostel?.availableRooms,
          });
      } catch { /* non-critical */ }
    }

    res.status(200).json({ message: "Student removed successfully" });
  } catch (err) {
    logger.error("Error deleting student: " + err.message);
    res.status(500).json({ message: "Failed to remove student." });
  }
};

/**
 * Get all students owned by the logged-in owner (paginated)
 * @route GET /api/students/owner-students?page=1&limit=20
 */
exports.getOwnerStudents = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    // Phase 1: filter uses currentOwner (renamed from owner)
    const filter = { currentOwner: ownerId };

    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate("user", "name email phone")  // name/email/phone now on User
        .populate("currentHostel", "name")
        .populate("currentRoom", "roomNumber floor status")
        .select("_id roomNumber status currentHostel currentRoom activeBooking user")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Student.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      students,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    logger.error("Error fetching owner's students: " + err.message);
    res.status(500).json({ success: false, message: "Failed to fetch students." });
  }
};

/**
 * Get roommates (students sharing the same room)
 * @route GET /api/students/my-roommates
 */
exports.getMyRoommates = async (req, res) => {
  try {
    const userId = req.user.id;

    const currentStudent = await Student.findOne({ user: userId });

    if (!currentStudent) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    // Phase 1: use currentRoom (ObjectId) for roommate matching — far more reliable
    // than roomNumber string comparison across different hostels
    if (
      !currentStudent.currentHostel ||
      !currentStudent.currentRoom ||
      currentStudent.status !== "Active"
    ) {
      return res.status(200).json({
        success: true,
        message: "You are not currently assigned to a room.",
        roommates: [],
      });
    }

    const roommates = await Student.find({
      currentRoom: currentStudent.currentRoom,  // ObjectId match — exact and safe
      _id: { $ne: currentStudent._id },
      status: "Active",
    })
      .populate("user", "name email phone")
      .select("user status");

    res.status(200).json({
      success: true,
      count: roommates.length,
      roommates,
    });
  } catch (err) {
    logger.error("Error fetching roommates: " + err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roommates.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Search for hostels based on location and query
exports.searchHostels = async (req, res) => {
  try {
    const { location, search } = req.query;

    const searchQuery = { isActive: true };

    if (
      location &&
      location.trim() &&
      location !== "Others" &&
      location !== "All"
    ) {
      searchQuery.locality = { $regex: location.trim(), $options: "i" };
    }

    if (search && search.trim()) {
      searchQuery.name = { $regex: search.trim(), $options: "i" };
    }

    let hostels = await Hostel.find(searchQuery).sort({ createdAt: -1 });

    const hostelsWithAvailability = hostels.map((hostel) => {
      const h = hostel.toObject();
      h.available = hostel.availableRooms > 0;
      h.id = hostel._id;
      return h;
    });

    res.status(200).json({
      success: true,
      count: hostelsWithAvailability.length,
      hostels: hostelsWithAvailability,
    });
  } catch (err) {
    logger.error("Error searching hostels: " + err.message);
    res.status(500).json({
      success: false,
      message: "Failed to search for hostels.",
    });
  }
};

// Create a new booking request
exports.createBookingRequest = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { hostelId } = req.body;

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found." });
    }

    const existingBooking = await Booking.findOne({
      student: studentId,
      status: { $in: ["Pending", "Active"] },
    });
    if (existingBooking) {
      return res
        .status(409)
        .json({ message: "You already have a pending or active booking." });
    }

    const newBooking = new Booking({
      student: studentId,
      hostel: hostelId,
      owner: hostel.owner,
      status: "Pending",
      roomNumber: 0,
      checkInDate: new Date(),
    });

    await newBooking.save();
    res.status(201).json({
      message: "Booking request sent successfully.",
      booking: newBooking,
    });
  } catch (err) {
    logger.error("Error creating booking request: " + err.message);
    res.status(500).json({ message: "Failed to create booking request." });
  }
};

// Get all bookings for a specific student
exports.getStudentBookings = async (req, res) => {
  try {
    const studentId = req.user.id;
    const bookings = await Booking.find({ student: studentId })
      .populate("hostel", "name images")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    logger.error("Error fetching student bookings: " + err.message);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
};

// Get the student's active hostel
exports.getStudentHostel = async (req, res) => {
  try {
    const studentId = req.user.id;

    const activeBooking = await Booking.findOne({
      student: studentId,
      status: "Active",
    }).populate("hostel");

    if (!activeBooking) {
      return res
        .status(404)
        .json({ message: "No active hostel found for this student." });
    }

    res.status(200).json({ hostel: activeBooking.hostel });
  } catch (err) {
    logger.error("Error fetching student's hostel: " + err.message);
    res.status(500).json({ message: "Failed to fetch student's hostel." });
  }
};

exports.getStudentDashboardMetrics = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await Student.findOne({ user: userId }).populate(
      "currentHostel",
      "name locality"
    );

    const hostelName = student?.currentHostel?.name || "N/A";
    const roomNumber = student?.roomNumber || "N/A";
    const status = student?.status || "Searching";

    let pendingDuesCount = 0;
    let pendingDuesAmount = 0;

    if (student) {
      const pendingDues = await Due.find({
        student: student._id,
        status: { $in: ["PENDING", "OVERDUE", "PARTIAL"] },
      }).select("amount fineAmount paidAmount");

      pendingDuesCount = pendingDues.length;
      pendingDuesAmount = pendingDues.reduce(
        (sum, due) => sum + Math.max(0, due.amount + due.fineAmount - due.paidAmount),
        0
      );
    }

    res.json({
      hostelName,
      roomNumber,
      status,
      pendingDuesCount,
      pendingDuesAmount,
    });
  } catch (err) {
    logger.error("Error fetching dashboard metrics: " + err.message);
    res.status(500).json({ message: "Failed to load metrics" });
  }
};

// ==================== INTERESTED / WISHLIST ====================

exports.getInterestedHostels = async (req, res) => {
  try {
    const userId = req.user.id;
    // Phase 1: interestedHostels moved from User → Student
    const student = await Student.findOne({ user: userId }).populate("interestedHostels");

    if (!student) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const formattedHostels = (student.interestedHostels || []).map((hostel) => {
      const h = hostel.toObject();
      h.id = h._id;
      h.image = h.images && h.images.length > 0 ? h.images[0] : null;
      return h;
    });

    res.status(200).json({
      success: true,
      count: formattedHostels.length,
      data: formattedHostels,
    });
  } catch (err) {
    logger.error("Error fetching interested hostels: " + err.message);
    res.status(500).json({ message: "Failed to fetch interested hostels." });
  }
};

exports.toggleInterestedHostel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hostelId } = req.params;

    // Phase 1: interestedHostels moved from User → Student
    const student = await Student.findOne({ user: userId });
    if (!student) {
      // Auto-create minimal student profile if not exists
      return res.status(404).json({ message: "Student profile not found" });
    }

    if (!student.interestedHostels) student.interestedHostels = [];

    const hostelObjectId = new mongoose.Types.ObjectId(hostelId);
    const index = student.interestedHostels.findIndex(
      (id) => id.toString() === hostelId
    );
    let message, added;

    if (index === -1) {
      student.interestedHostels.push(hostelObjectId);
      message = "Added to interested list";
      added = true;
    } else {
      student.interestedHostels.splice(index, 1);
      message = "Removed from interested list";
      added = false;
    }

    await student.save();
    res.status(200).json({ success: true, message, added });
  } catch (err) {
    logger.error("Error toggling interested hostel: " + err.message);
    res.status(500).json({ message: "Failed to update interested list." });
  }
};

exports.removeInterestedHostel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hostelId } = req.params;

    // Phase 1: interestedHostels on Student, not User
    await Student.findOneAndUpdate(
      { user: userId },
      { $pull: { interestedHostels: new mongoose.Types.ObjectId(hostelId) } }
    );

    res.status(200).json({ success: true, message: "Removed from interested list" });
  } catch (err) {
    logger.error("Error removing interested hostel: " + err.message);
    res.status(500).json({ message: "Failed to remove from interested list." });
  }
};

exports.clearInterestedHostels = async (req, res) => {
  try {
    const userId = req.user.id;
    // Phase 1: interestedHostels on Student, not User
    await Student.findOneAndUpdate(
      { user: userId },
      { $set: { interestedHostels: [] } }
    );
    res.status(200).json({ success: true, message: "Cleared all interested hostels" });
  } catch (err) {
    logger.error("Error clearing interested hostels: " + err.message);
    res.status(500).json({ message: "Failed to clear interested hostels." });
  }
};

// ==================== RECENTLY VIEWED ====================

exports.addToRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hostelId } = req.body;

    if (!hostelId) {
      return res.status(400).json({ message: "Hostel ID is required" });
    }

    // Phase 1: recentlyViewed moved from User → Student
    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    if (!student.recentlyViewed) student.recentlyViewed = [];

    // Remove duplicate if already in list
    student.recentlyViewed = student.recentlyViewed.filter(
      (item) => item.hostel.toString() !== hostelId
    );

    student.recentlyViewed.unshift({ hostel: hostelId, viewedAt: new Date() });

    if (student.recentlyViewed.length > 10) {
      student.recentlyViewed = student.recentlyViewed.slice(0, 10);
    }

    await student.save();
    res.status(200).json({ success: true, message: "Added to view history" });
  } catch (err) {
    logger.error("Error adding to recently viewed: " + err.message);
    res.status(500).json({ message: "Failed to update view history." });
  }
};

exports.getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user.id;
    // Phase 1: recentlyViewed on Student, not User
    const student = await Student.findOne({ user: userId }).populate("recentlyViewed.hostel");

    if (!student) {
      return res.status(200).json({ success: true, data: [] });
    }

    const history = (student.recentlyViewed || [])
      .filter((item) => item.hostel)
      .map((item) => {
        const h = item.hostel.toObject();
        h.viewedAt = item.viewedAt;
        h.image = h.images && h.images.length > 0 ? h.images[0] : null;
        return h;
      });

    res.status(200).json({ success: true, data: history });
  } catch (err) {
    logger.error("Error fetching view history: " + err.message);
    res.status(500).json({ message: "Failed to fetch view history." });
  }
};

exports.clearRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user.id;
    // Phase 1: recentlyViewed on Student, not User
    await Student.findOneAndUpdate(
      { user: userId },
      { $set: { recentlyViewed: [] } }
    );
    res.status(200).json({ success: true, message: "Cleared view history" });
  } catch (err) {
    logger.error("Error clearing view history: " + err.message);
    res.status(500).json({ message: "Failed to clear view history." });
  }
};

exports.removeFromRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hostelId } = req.params;

    // Phase 1: recentlyViewed on Student, not User
    await Student.findOneAndUpdate(
      { user: userId },
      { $pull: { recentlyViewed: { hostel: new mongoose.Types.ObjectId(hostelId) } } }
    );

    res.status(200).json({ success: true, message: "Removed from view history" });
  } catch (err) {
    logger.error("Error removing from view history: " + err.message);
    res.status(500).json({ message: "Failed to remove from view history." });
  }
};
