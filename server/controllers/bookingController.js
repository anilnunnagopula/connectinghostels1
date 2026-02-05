/**
 * Booking Controller - FIXED VERSION
 *
 * FIXES:
 * 1. Changed const to let in getStudentRequests
 * 2. Simplified error handling
 * 3. Better response for missing student profiles
 */

const BookingRequest = require("../models/BookingRequest");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const mongoose = require("mongoose");

// ============================================================================
// STUDENT ACTIONS
// ============================================================================

/**
 * Create Booking Request (Student)
 */
/**
 * Create Booking Request (Student) - WITH AUTO-PROFILE CREATION
 *
 * This version automatically creates a basic Student profile if it doesn't exist
 * Uses data from the authenticated User model (req.user)
 */
exports.createBookingRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { hostelId, floor, roomNumber } = req.body;
    const userId = req.user.id;

    console.log("📨 Creating booking request:", {
      userId,
      hostelId,
      floor,
      roomNumber,
    });

    // VALIDATION 1: Find or create student profile
    let student = await Student.findOne({ user: userId }).session(session);
    
    if (!student) {
      // ✅ AUTO-CREATE: Create basic profile from User data
      console.log("📝 Auto-creating student profile from User data");
      
      // Validate required fields from User model
      if (!req.user.name || !req.user.email) {
        await session.abortTransaction();
        return res.status(400).json({
          error: "Your account is missing required information. Please complete your profile first.",
          missingFields: {
            name: !req.user.name,
            email: !req.user.email,
          }
        });
      }

      // Get phone from User model or use a default
      const phone = req.user.phone || "0000000000"; // Fallback if phone not required
      
      student = new Student({
        user: userId,
        name: req.user.name,
        email: req.user.email,
        phone: phone,
        status: "Searching",
      });
      
      await student.save({ session });
      console.log("✅ Student profile auto-created:", student._id);
    }

    // VALIDATION 2: Check if student already admitted
    if (student.currentHostel) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "You are already admitted to a hostel. Please vacate first.",
      });
    }

    // VALIDATION 3: Check for existing pending request
    const existingRequest = await BookingRequest.findOne({
      student: student._id,
      status: "Pending",
    }).session(session);

    if (existingRequest) {
      await session.abortTransaction();
      return res.status(400).json({
        error:
          "You already have a pending request. Please wait for owner's response.",
        existingRequest: {
          hostelId: existingRequest.hostel,
          floor: existingRequest.floor,
          roomNumber: existingRequest.roomNumber,
          requestedAt: existingRequest.createdAt,
        },
      });
    }

    // VALIDATION 4: Verify hostel exists
    const hostel = await Hostel.findById(hostelId).session(session);
    if (!hostel) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Hostel not found." });
    }

    // VALIDATION 5: Validate floor number
    if (floor < 1 || floor > hostel.floors) {
      await session.abortTransaction();
      return res.status(400).json({
        error: `Invalid floor number. This hostel has ${hostel.floors} floor(s).`,
      });
    }

    // VALIDATION 6: Basic room number validation
    if (!roomNumber || roomNumber < 1) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "Please provide a valid room number.",
      });
    }

    // CREATE REQUEST
    const newRequest = new BookingRequest({
      student: student._id,
      hostel: hostelId,
      owner: hostel.ownerId,
      floor,
      roomNumber,
      status: "Pending",
    });

    // UPDATE STUDENT STATUS
    student.status = "Pending Approval";

    // SAVE BOTH DOCUMENTS
    await newRequest.save({ session });
    await student.save({ session });

    await session.commitTransaction();

    console.log("✅ Booking request created:", newRequest._id);

    res.status(201).json({
      message: "Request sent successfully! The owner will review it soon.",
      request: {
        id: newRequest._id,
        hostelId: newRequest.hostel,
        floor: newRequest.floor,
        roomNumber: newRequest.roomNumber,
        status: newRequest.status,
        createdAt: newRequest.createdAt,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("❌ Error creating booking request:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        error: "You already have a pending request for this hostel.",
      });
    }

    res.status(500).json({
      error: "Server error while creating request.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  } finally {
    session.endSession();
  }
};

/**
 * Get Student's Own Requests - FIXED
 *
 * @route GET /api/students/my-requests
 */
exports.getStudentRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ FIXED: Use let instead of const
    let student = await Student.findOne({ user: userId });

    if (!student) {
      // ✅ FIXED: Return 200 with empty data instead of 404
      return res.status(200).json({
        requests: [],
        studentStatus: "No Profile",
        currentHostel: null,
      });
    }

    // Get all requests
    const requests = await BookingRequest.find({ student: student._id })
      .populate("hostel", "name location type price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      requests,
      studentStatus: student.status,
      currentHostel: student.currentHostel,
    });
  } catch (err) {
    console.error("❌ Error fetching student requests:", err);
    res.status(500).json({
      error: "Failed to fetch requests.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Cancel Pending Request (Student)
 */
exports.cancelBookingRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const student = await Student.findOne({ user: userId }).session(session);
    if (!student) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Student profile not found." });
    }

    const request = await BookingRequest.findOne({
      _id: requestId,
      student: student._id,
      status: "Pending",
    }).session(session);

    if (!request) {
      await session.abortTransaction();
      return res.status(404).json({
        error: "Request not found or cannot be cancelled.",
      });
    }

    await BookingRequest.deleteOne({ _id: requestId }).session(session);

    student.status = "Searching";
    await student.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      message: "Request cancelled successfully.",
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("Error cancelling request:", err);
    res.status(500).json({ error: "Failed to cancel request." });
  } finally {
    session.endSession();
  }
};

// ============================================================================
// OWNER ACTIONS
// ============================================================================

exports.getOwnerBookingRequests = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const requests = await BookingRequest.find({
      owner: ownerId,
      status: "Pending",
    })
      .populate("student", "name email phone")
      .populate("hostel", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      requests,
      count: requests.length,
    });
  } catch (err) {
    console.error("Error fetching owner requests:", err);
    res.status(500).json({ error: "Failed to fetch booking requests." });
  }
};

exports.approveBookingRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { requestId } = req.params;
    const ownerId = req.user.id;

    console.log("✅ Approving request:", { requestId, ownerId });

    const request = await BookingRequest.findOne({
      _id: requestId,
      owner: ownerId,
    }).session(session);

    if (!request) {
      await session.abortTransaction();
      return res.status(404).json({
        error: "Request not found or unauthorized.",
      });
    }

    if (request.status !== "Pending") {
      await session.abortTransaction();
      return res.status(400).json({
        error: `Request already ${request.status.toLowerCase()}.`,
      });
    }

    const student = await Student.findById(request.student).session(session);
    if (!student) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Student not found." });
    }

    if (student.currentHostel) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "Student is already admitted to another hostel.",
      });
    }

    request.status = "Approved";
    await request.save({ session });

    student.currentHostel = request.hostel;
    student.roomNumber = request.roomNumber;
    student.owner = request.owner;
    student.status = "Active";
    await student.save({ session });

    await session.commitTransaction();

    console.log("✅ Request approved successfully");

    res.status(200).json({
      message: "Student successfully admitted to hostel.",
      student: {
        name: student.name,
        hostel: request.hostel,
        floor: request.floor,
        roomNumber: request.roomNumber,
        status: student.status,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("❌ Error approving request:", err);
    res.status(500).json({
      error: "Failed to approve request.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  } finally {
    session.endSession();
  }
};

exports.rejectBookingRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { requestId } = req.params;
    const { reason } = req.body;
    const ownerId = req.user.id;

    console.log("❌ Rejecting request:", { requestId, ownerId });

    const request = await BookingRequest.findOne({
      _id: requestId,
      owner: ownerId,
    }).session(session);

    if (!request) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Request not found." });
    }

    if (request.status !== "Pending") {
      await session.abortTransaction();
      return res.status(400).json({
        error: `Request already ${request.status.toLowerCase()}.`,
      });
    }

    request.status = "Rejected";
    if (reason) request.rejectionReason = reason;
    await request.save({ session });

    await Student.findByIdAndUpdate(
      request.student,
      { status: "Searching" },
      { session },
    );

    await session.commitTransaction();

    console.log("❌ Request rejected:", requestId);

    res.status(200).json({
      message: "Request rejected.",
      reason: reason || "No reason provided",
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("Error rejecting request:", err);
    res.status(500).json({ error: "Failed to reject request." });
  } finally {
    session.endSession();
  }
};

module.exports = exports;
