/**
 * Booking Controller - COMPLETE WITH DEBUG LOGGING
 *
 * FEATURES:
 * 1. Auto-creates student profile if missing
 * 2. Comprehensive logging for debugging
 * 3. Transaction safety
 * 4. Handles duplicate student profiles
 */

const BookingRequest = require("../models/BookingRequest");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const mongoose = require("mongoose");

// ============================================================================
// STUDENT ACTIONS
// ============================================================================

/**
 * Create Booking Request (Student) - WITH AUTO-PROFILE CREATION
 *
 * @route POST /api/students/booking-request
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

    // VALIDATION 1: Find or handle student profile
    let student = await Student.findOne({ user: userId }).session(session);

    if (!student) {
      console.log(
        "📝 No student profile linked to user, checking for orphaned profile...",
      );

      // Check if there's an orphaned student profile with this email
      const orphanedStudent = await Student.findOne({
        email: req.user.email,
        user: { $exists: false }, // No user link OR different user
      }).session(session);

      if (orphanedStudent) {
        console.log("🔗 Found orphaned profile, linking to user...");
        // Link the orphaned profile to this user
        orphanedStudent.user = userId;
        await orphanedStudent.save({ session });
        student = orphanedStudent;
        console.log("✅ Orphaned profile linked:", student._id);
      } else {
        // No orphaned profile, try to create new one
        console.log("📝 Creating new student profile from User data");

        if (!req.user.name || !req.user.email) {
          await session.abortTransaction();
          return res.status(400).json({
            error:
              "Your account is missing required information. Please complete your profile first.",
            missingFields: {
              name: !req.user.name,
              email: !req.user.email,
            },
          });
        }

        const phone = req.user.phone || "0000000000";

        student = new Student({
          user: userId,
          name: req.user.name,
          email: req.user.email,
          phone: phone,
          status: "Searching",
        });

        await student.save({ session });
        console.log("✅ Student profile created:", student._id);
      }
    } else {
      console.log("✅ Student found:", student._id);
    }

    // VALIDATION 2: Check if student already admitted
    if (student.currentHostel) {
      console.log("⚠️ Student already admitted to:", student.currentHostel);
      await session.abortTransaction();
      return res.status(400).json({
        error: "You are already admitted to a hostel. Please vacate first.",
      });
    }

    // VALIDATION 3: Check for existing pending request
    const existingRequest = await BookingRequest.findOne({
      student: student._id,
      status: "Pending",
    })
      .session(session)
      .populate("hostel", "name");

    if (existingRequest) {
      console.log("⚠️ Existing pending request found:", {
        requestId: existingRequest._id,
        hostel: existingRequest.hostel?.name,
      });
      await session.abortTransaction();
      return res.status(400).json({
        error:
          "You already have a pending request. Please wait for owner's response.",
        existingRequest: {
          hostelId: existingRequest.hostel,
          hostelName: existingRequest.hostel?.name,
          floor: existingRequest.floor,
          roomNumber: existingRequest.roomNumber,
          requestedAt: existingRequest.createdAt,
        },
      });
    }

    // VALIDATION 4: Verify hostel exists
    const hostel = await Hostel.findById(hostelId).session(session);
    if (!hostel) {
      console.log("❌ Hostel not found:", hostelId);
      await session.abortTransaction();
      return res.status(404).json({ error: "Hostel not found." });
    }

    console.log("✅ Hostel found:", {
      hostelId: hostel._id,
      ownerId: hostel.ownerId,
      name: hostel.name,
    });

    // VALIDATION 5: Validate floor number
    if (floor < 1 || floor > hostel.floors) {
      console.log("❌ Invalid floor:", floor, "Max:", hostel.floors);
      await session.abortTransaction();
      return res.status(400).json({
        error: `Invalid floor number. This hostel has ${hostel.floors} floor(s).`,
      });
    }

    // VALIDATION 6: Basic room number validation
    if (!roomNumber || roomNumber < 1) {
      console.log("❌ Invalid room number:", roomNumber);
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

    console.log("💾 Saving new request:", {
      student: newRequest.student,
      hostel: newRequest.hostel,
      owner: newRequest.owner,
      floor: newRequest.floor,
      roomNumber: newRequest.roomNumber,
    });

    // UPDATE STUDENT STATUS
    student.status = "Pending Approval";

    // SAVE BOTH DOCUMENTS
    await newRequest.save({ session });
    await student.save({ session });

    await session.commitTransaction();

    console.log("✅ Booking request created successfully:", {
      requestId: newRequest._id,
      studentId: student._id,
      hostelId: newRequest.hostel,
      ownerId: newRequest.owner,
    });

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
    console.error("❌ Error stack:", err.stack);

    if (err.code === 11000) {
      return res.status(400).json({
        error:
          "A student profile with this email already exists. Please contact support.",
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
 * Get Student's Own Requests
 *
 * @route GET /api/students/my-requests
 */
exports.getStudentRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("📋 Fetching requests for user:", userId);

    // Find ALL student profiles for this user (handles potential duplicates)
    const students = await Student.find({ user: userId }).sort({
      createdAt: -1,
    });

    if (!students || students.length === 0) {
      console.log("⚠️ No student profile found for user:", userId);
      return res.status(200).json({
        requests: [],
        studentStatus: "No Profile",
        currentHostel: null,
      });
    }

    console.log(
      "✅ Found student profiles:",
      students.map((s) => s._id),
    );

    // Use the most recent profile as the "primary" one
    const primaryStudent = students[0];
    const studentIds = students.map((s) => s._id);

    // Find requests for ANY of the student's profiles
    const requests = await BookingRequest.find({ student: { $in: studentIds } })
      .populate("hostel", "name location type price")
      .sort({ createdAt: -1 });

    console.log("📦 Found requests:", {
      count: requests.length,
      requests: requests.map((r) => ({
        id: r._id,
        status: r.status,
        hostel: r.hostel?.name,
        floor: r.floor,
        roomNumber: r.roomNumber,
        createdAt: r.createdAt,
      })),
    });

    res.status(200).json({
      requests,
      studentStatus: primaryStudent.status,
      currentHostel: primaryStudent.currentHostel,
    });
  } catch (err) {
    console.error("❌ Error fetching student requests:", err);
    res.status(500).json({ error: "Failed to fetch requests." });
  }
};

/**
 * Cancel Pending Request (Student)
 *
 * @route DELETE /api/students/booking-request/:requestId
 */
exports.cancelBookingRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    console.log("🗑️ Cancelling request:", { requestId, userId });

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

    console.log("✅ Request cancelled successfully");

    res.status(200).json({
      message: "Request cancelled successfully.",
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("❌ Error cancelling request:", err);
    res.status(500).json({ error: "Failed to cancel request." });
  } finally {
    session.endSession();
  }
};

// ============================================================================
// OWNER ACTIONS
// ============================================================================

/**
 * Get All Pending Requests for Owner
 *
 * @route GET /api/owner/booking-requests/mine
 */
exports.getOwnerBookingRequests = async (req, res) => {
  try {
    const ownerId = req.user.id;

    console.log("📋 Fetching booking requests for owner:", ownerId);

    const requests = await BookingRequest.find({
      owner: ownerId,
      status: "Pending",
    })
      .populate("student", "name email phone")
      .populate("hostel", "name location")
      .sort({ createdAt: -1 });

    console.log("📦 Found owner requests:", {
      count: requests.length,
      requests: requests.map((r) => ({
        id: r._id,
        student: r.student?.name,
        hostel: r.hostel?.name,
        status: r.status,
        floor: r.floor,
        roomNumber: r.roomNumber,
      })),
    });

    res.status(200).json({
      requests,
      count: requests.length,
    });
  } catch (err) {
    console.error("❌ Error fetching owner requests:", err);
    res.status(500).json({ error: "Failed to fetch booking requests." });
  }
};

/**
 * Approve Booking Request (Owner)
 *
 * @route POST /api/owner/booking-requests/:requestId/approve
 */
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
    // Around line 270 in bookingController.js, AFTER student.save()

    // ✅ AUTO-NOTIFICATION: Send welcome notification
    try {
      const Notification = require("../models/Notification");

      await Notification.create({
        recipientStudent: student._id,
        recipientHostel: request.hostel,
        sender: ownerId,
        senderRole: "owner",
        message: `🎉 Congratulations! Your booking request has been approved. Welcome to ${hostel.name}! Your room number is ${request.roomNumber} on floor ${request.floor}.`,
        type: "welcome",
        isRead: false,
      });

      console.log("✅ Welcome notification sent to student");
    } catch (notifErr) {
      console.error("⚠️ Failed to send welcome notification:", notifErr);
      // Don't fail the approval if notification fails
    }

    student.currentHostel = request.hostel;
    student.roomNumber = request.roomNumber;
    student.owner = request.owner;
    student.status = "Active";
    await student.save({ session });

    await session.commitTransaction();

    console.log("✅ Request approved successfully:", {
      requestId,
      studentId: student._id,
      hostelId: request.hostel,
    });

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

/**
 * Reject Booking Request (Owner)
 *
 * @route POST /api/owner/booking-requests/:requestId/reject
 */
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
    // Around line 320, AFTER request.save()

    // ✅ AUTO-NOTIFICATION: Send rejection notification
    try {
      const Notification = require("../models/Notification");

      await Notification.create({
        recipientStudent: request.student,
        recipientHostel: request.hostel,
        sender: ownerId,
        senderRole: "owner",
        message: `Your booking request has been declined. ${reason ? `Reason: ${reason}` : "Please contact the hostel for more information."}`,
        type: "alert",
        isRead: false,
      });

      console.log("✅ Rejection notification sent to student");
    } catch (notifErr) {
      console.error("⚠️ Failed to send rejection notification:", notifErr);
    }

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
    console.error("❌ Error rejecting request:", err);
    res.status(500).json({ error: "Failed to reject request." });
  } finally {
    session.endSession();
  }
};

module.exports = exports;
