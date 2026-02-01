const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const Booking = require("../models/StudentHostel");
const mongoose = require("mongoose"); 
const Complaint = require("../models/Complaint"); 
const Payment = require("../models/Payment");

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
      return res.status(400).json({ message: "No available rooms in this hostel." });
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
      "name"
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
     const { location } = req.query;

     const searchQuery = { available: true };

     if (location && location.trim() && location !== "Others") {
       searchQuery.location = { $regex: location.trim(), $options: "i" };
     }

     // Fetch all hostels matching location
     const hostels = await Hostel.find(searchQuery).sort({ createdAt: -1 });

     res.status(200).json({
       success: true,
       count: hostels.length,
       hostels,
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
    res
      .status(201)
      .json({
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
