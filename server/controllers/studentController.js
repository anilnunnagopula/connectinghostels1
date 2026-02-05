const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const Booking = require("../models/StudentHostel");
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const Payment = require("../models/Payment");
const User = require("../models/User");

exports.addStudent = async (req, res) => {
  try {
    const { name, email, phone, address, hostel, floor, room } = req.body;
    const ownerId = req.user.id;

    if (!name || !email || !phone || !hostel || !floor || !room) {
      return res
        .status(400)
        .json({ message: "All required fields are needed." });
    }

    // 1. Check Hostel Availability
    const hostelDoc = await Hostel.findOne({ _id: hostel, ownerId });
    if (!hostelDoc) {
      return res.status(404).json({ message: "Hostel not found." });
    }

    if (hostelDoc.availableRooms <= 0) {
      return res
        .status(400)
        .json({ message: "No available rooms in this hostel." });
    }

    const newStudent = new Student({
      name,
      email,
      phone,
      address,
      hostel,
      floor,
      room,
      owner: ownerId,
    });

    await newStudent.save();

    // 2. Decrement Available Rooms
    hostelDoc.availableRooms = Math.max(0, hostelDoc.availableRooms - 1);
    await hostelDoc.save();

    res
      .status(201)
      .json({ message: "Student added successfully", student: newStudent });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email or phone number already exists." });
    }
    console.error("Error adding student:", err);
    res.status(500).json({ message: "Failed to add student." });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const ownerId = req.user.id; // Verify ownership

    const student = await Student.findOne({ _id: studentId, owner: ownerId });
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // 1. Increment Available Rooms
    if (student.hostel) {
      const hostelDoc = await Hostel.findById(student.hostel);
      if (hostelDoc) {
        // Ensure we don't exceed total rooms (safety check)
        if (hostelDoc.availableRooms < hostelDoc.totalRooms) {
          hostelDoc.availableRooms += 1;
          await hostelDoc.save();
        }
      }
    }

    // 2. Delete Student
    await Student.findByIdAndDelete(studentId);

    res.status(200).json({ message: "Student removed successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Failed to remove student." });
  }
};

exports.getOwnerStudents = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const students = await Student.find({ owner: ownerId }).populate(
      "hostel",
      "name",
    );
    res.status(200).json({ students });
  } catch (err) {
    console.error("Error fetching owner's students:", err);
    res.status(500).json({ message: "Failed to fetch students." });
  }
};

// Search for hostels based on location and query
exports.searchHostels = async (req, res) => {
  try {
    const { location, search } = req.query;

    // 1. Start with an empty query (or isActive if you use that field)
    // If you haven't set 'isActive' to true for your hostels yet,
    // comment out the next line and use: const searchQuery = {};
    const searchQuery = { isActive: true };

    // 2. Handle Location Filter
    if (
      location &&
      location.trim() &&
      location !== "Others" &&
      location !== "All"
    ) {
      // Use Regex for "like" matching (e.g., "Mangal" will find "Mangalpally")
      // 'i' makes it case-insensitive
      searchQuery.locality = { $regex: location.trim(), $options: "i" };
    }

    // 3. Handle Name Search
    if (search && search.trim()) {
      searchQuery.name = { $regex: search.trim(), $options: "i" };
    }

    console.log("Applying Search Query:", searchQuery);

    // 4. Fetch hostels
    let hostels = await Hostel.find(searchQuery).sort({ createdAt: -1 });

    // 5. Map data for Frontend
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
    console.error("❌ Error searching hostels:", err);
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
    console.error("Error creating booking request:", err);
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
    console.error("Error fetching student bookings:", err);
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
    console.error("Error fetching student's hostel:", err);
    res.status(500).json({ message: "Failed to fetch student's hostel." });
  }
};

exports.getStudentDashboardMetrics = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Count total hostels
    const totalHostels = await Hostel.countDocuments({ students: studentId });

    // Count active and pending complaints
    const pendingComplaints = await Complaint.countDocuments({
      student: studentId,
      status: "Pending",
    });

    // Find the student's active booking
    const activeBooking = await Booking.findOne({
      student: studentId,
      status: "Active",
    }).populate("hostel");
    const hostelName = activeBooking ? activeBooking.hostel.name : "N/A";
    const roomNumber = activeBooking ? activeBooking.roomNumber : "N/A";

    // Find pending fees (placeholder logic)
    const pendingFees = await Payment.countDocuments({
      student: studentId,
      status: "Pending",
    });

    res.json({
      hostelName,
      roomNumber,
      pendingFees,
      pendingComplaints,
    });
  } catch (err) {
    console.error("Error fetching dashboard metrics:", err);
    res.status(500).json({ message: "Failed to load metrics" });
  }
};

// ==================== INTERESTED / WISHLIST ====================

// Get all interested hostels
exports.getInterestedHostels = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("interestedHostels");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Map to format expected by frontend
    const formattedHostels = user.interestedHostels.map((hostel) => {
      const h = hostel.toObject();
      h.id = h._id;
      h.image = h.images && h.images.length > 0 ? h.images[0] : null; // Use first image
      return h;
    });

    res
      .status(200)
      .json({
        success: true,
        count: formattedHostels.length,
        data: formattedHostels,
      });
  } catch (err) {
    console.error("Error fetching interested hostels:", err);
    res.status(500).json({ message: "Failed to fetch interested hostels." });
  }
};

// Toggle interested hostel (Add/Remove)
exports.toggleInterestedHostel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hostelId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize if undefined
    if (!user.interestedHostels) {
      user.interestedHostels = [];
    }

    const index = user.interestedHostels.indexOf(hostelId);
    let message = "";
    let added = false;

    if (index === -1) {
      // Add
      user.interestedHostels.push(hostelId);
      message = "Added to interested list";
      added = true;
    } else {
      // Remove
      user.interestedHostels.splice(index, 1);
      message = "Removed from interested list";
      added = false;
    }

    await user.save();
    res.status(200).json({ success: true, message, added });
  } catch (err) {
    console.error("Error toggling interested hostel:", err);
    res.status(500).json({ message: "Failed to update interested list." });
  }
};

// Remove interested hostel (Explicit Delete)
exports.removeInterestedHostel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hostelId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { interestedHostels: hostelId },
    });

    res
      .status(200)
      .json({ success: true, message: "Removed from interested list" });
  } catch (err) {
    console.error("Error removing interested hostel:", err);
    res.status(500).json({ message: "Failed to remove from interested list." });
  }
};

// Clear all interested hostels
exports.clearInterestedHostels = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      $set: { interestedHostels: [] },
    });

    res
      .status(200)
      .json({ success: true, message: "Cleared all interested hostels" });
  } catch (err) {
    console.error("Error clearing interested hostels:", err);
    res.status(500).json({ message: "Failed to clear interested hostels." });
  }
};

// ==================== RECENTLY VIEWED ====================

// Add to recently viewed
exports.addToRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hostelId } = req.body;

    if (!hostelId) {
      return res.status(400).json({ message: "Hostel ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize if undefined
    if (!user.recentlyViewed) {
      user.recentlyViewed = [];
    }

    // Remove existing entry for this hostel to bring it to top
    user.recentlyViewed = user.recentlyViewed.filter(
      (item) => item.hostel.toString() !== hostelId,
    );

    // Add to beginning
    user.recentlyViewed.unshift({
      hostel: hostelId,
      viewedAt: new Date(),
    });

    // Limit to 10 items
    if (user.recentlyViewed.length > 10) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 10);
    }

    await user.save();
    res.status(200).json({ success: true, message: "Added to view history" });
  } catch (err) {
    console.error("Error adding to recently viewed:", err);
    res.status(500).json({ message: "Failed to update view history." });
  }
};

// Get recently viewed hostels
exports.getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("recentlyViewed.hostel");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out null hostels (in case they were deleted)
    const history = user.recentlyViewed
      .filter((item) => item.hostel)
      .map((item) => {
        const h = item.hostel.toObject();
        h.viewedAt = item.viewedAt;
        h.image = h.images && h.images.length > 0 ? h.images[0] : null;
        return h;
      });

    res.status(200).json({ success: true, data: history });
  } catch (err) {
    console.error("Error fetching view history:", err);
    res.status(500).json({ message: "Failed to fetch view history." });
  }
};

// Clear all recently viewed
exports.clearRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      $set: { recentlyViewed: [] },
    });

    res.status(200).json({ success: true, message: "Cleared view history" });
  } catch (err) {
    console.error("Error clearing view history:", err);
    res.status(500).json({ message: "Failed to clear view history." });
  }
};

// Remove specific hostel from recently viewed
exports.removeFromRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hostelId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the specific hostel from recentlyViewed array
    user.recentlyViewed = user.recentlyViewed.filter(
      (item) => item.hostel.toString() !== hostelId,
    );

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Removed from view history" });
  } catch (err) {
    console.error("Error removing from view history:", err);
    res.status(500).json({ message: "Failed to remove from view history." });
  }
};
