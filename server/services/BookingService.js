/**
 * BookingService — All booking business logic extracted from bookingController.
 *
 * Controllers call these methods and map results to HTTP responses.
 * All DB mutations that touch > 1 collection are wrapped in a Mongoose session.
 *
 * Throws AppError for all domain-level failures so the global errorHandler
 * surfaces the right HTTP status code without try/catch boilerplate in controllers.
 */

const mongoose = require("mongoose");
const AppError = require("../middleware/AppError");
const logger = require("../middleware/logger");

const BookingRequest = require("../models/BookingRequest");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const Booking = require("../models/Booking");

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a Booking Request.
 * Finds or creates the student profile, validates the hostel/floor/room,
 * and saves a BookingRequest + updates student status — all in one transaction.
 *
 * @param {string} userId     - req.user.id (authenticated student)
 * @param {object} reqUser    - full req.user (name, email, phone for auto-create)
 * @param {object} body       - { hostelId, floor, roomNumber, roomId? }
 * @param {object} io         - socket.io instance (optional, for real-time emit)
 * @returns {object}          - { request, studentId }
 */
async function createRequest(userId, reqUser, { hostelId, floor, roomNumber, roomId }, io) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ── 1. Resolve student profile ───────────────────────────────────────────
    let student = await Student.findOne({ user: userId }).session(session);

    if (!student) {
      // Auto-create a minimal Student profile linked to this User
      student = new Student({ user: userId, status: "Searching" });
      await student.save({ session });
    }

    if (student.currentHostel) {
      throw new AppError(400, "You are already admitted to a hostel. Please vacate first.");
    }

    // ── 2. Guard: no duplicate pending request ───────────────────────────────
    const existingRequest = await BookingRequest.findOne({
      student: student._id,
      status: "Pending",
    })
      .session(session)
      .populate("hostel", "name");

    if (existingRequest) {
      throw new AppError(
        409,
        `You already have a pending request for ${existingRequest.hostel?.name || "a hostel"}. Please wait for the owner's response.`
      );
    }

    // ── 3. Validate hostel ───────────────────────────────────────────────────
    const hostel = await Hostel.findById(hostelId).session(session);
    if (!hostel) throw new AppError(404, "Hostel not found.");

    if (hostel.availableRooms <= 0) {
      throw new AppError(409, "This hostel is currently full.");
    }

    // ── 4. Validate floor (only when provided) ───────────────────────────────
    if (floor !== undefined && floor !== null) {
      if (floor < 1 || floor > hostel.floors) {
        throw new AppError(400, `Invalid floor. This hostel has ${hostel.floors} floor(s).`);
      }
    }

    // ── 5. Resolve Room ObjectId (Phase 1: prefer roomId over raw roomNumber) ─
    let resolvedRoomId = roomId || null;
    if (!resolvedRoomId && hostelId && roomNumber) {
      const roomDoc = await Room.findOne({
        hostel: hostelId,
        roomNumber: String(roomNumber),
        isDeleted: false,
      }).session(session).lean();
      resolvedRoomId = roomDoc?._id || null;
    }

    // ── 6. Create the request ────────────────────────────────────────────────
    const newRequest = new BookingRequest({
      student: student._id,
      hostel:  hostelId,
      owner:   hostel.ownerId,
      floor:   floor || undefined,
      roomNumber: roomNumber || undefined,
      room:    resolvedRoomId,
      status:  "Pending",
    });

    student.status = "Pending Approval";

    await newRequest.save({ session });
    await student.save({ session });
    await session.commitTransaction();

    logger.info(`BookingService.createRequest: requestId=${newRequest._id} studentId=${student._id}`);

    // Real-time notify owner (non-blocking, after commit)
    try {
      io?.to(`owner:${hostel.ownerId}`).emit("booking:new_request", {
        requestId:   newRequest._id,
        hostelName:  hostel.name,
      });
    } catch { /* non-critical */ }

    return { request: newRequest, studentId: student._id };
  } catch (err) {
    await session.abortTransaction();
    throw err; // re-throw AppError or unexpected errors
  } finally {
    session.endSession();
  }
}

/**
 * Cancel a pending Booking Request (student action).
 * Uses new 'Cancelled' status (Phase 1) rather than hard-delete.
 *
 * @param {string} requestId
 * @param {string} userId
 */
async function cancelRequest(requestId, userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const student = await Student.findOne({ user: userId }).session(session);
    if (!student) throw new AppError(404, "Student profile not found.");

    const request = await BookingRequest.findOne({
      _id:    requestId,
      student: student._id,
      status:  "Pending",
    }).session(session);

    if (!request) throw new AppError(404, "Request not found or cannot be cancelled.");

    // Phase 1: use Cancelled status instead of hard-delete (preserves audit trail)
    request.status = "Cancelled";
    await request.save({ session });

    student.status = "Searching";
    await student.save({ session });

    await session.commitTransaction();
    logger.info(`BookingService.cancelRequest: requestId=${requestId}`);
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OWNER ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Approve a Booking Request.
 * Atomically: updates Room.currentOccupants, decrements Hostel.availableRooms,
 * sets Student placement fields, creates a Booking contract.
 *
 * @param {string} requestId
 * @param {string} ownerId
 * @param {object} io   - socket.io instance (optional)
 * @returns {object}    - { student, booking }
 */
async function approve(requestId, ownerId, io) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ── 1. Load + guard request ──────────────────────────────────────────────
    const request = await BookingRequest.findOne({
      _id:   requestId,
      owner: ownerId,
    }).session(session);

    if (!request) throw new AppError(404, "Request not found or unauthorized.");
    if (request.status !== "Pending") {
      throw new AppError(400, `Request already ${request.status.toLowerCase()}.`);
    }

    // ── 2. Load hostel + availability guard ──────────────────────────────────
    const hostel = await Hostel.findById(request.hostel).session(session);
    if (!hostel) throw new AppError(404, "Hostel not found.");
    if (hostel.availableRooms <= 0) throw new AppError(409, "No available rooms in this hostel.");

    // ── 3. Load student + guard ──────────────────────────────────────────────
    const student = await Student.findById(request.student).session(session);
    if (!student) throw new AppError(404, "Student not found.");
    if (student.currentHostel) {
      throw new AppError(400, "Student is already admitted to another hostel.");
    }

    // ── 4. Resolve + update Room document ───────────────────────────────────
    // Prefer the request.room ObjectId (Phase 1); fall back to roomNumber lookup
    let room = null;
    if (request.room) {
      room = await Room.findById(request.room).session(session);
    }
    if (!room && request.roomNumber) {
      room = await Room.findOne({
        hostel:     request.hostel,
        roomNumber: String(request.roomNumber),
        isDeleted:  false,
      }).session(session);
    }

    if (room) {
      if (room.occupancyCount >= room.capacity) {
        throw new AppError(409, "That room is already full.");
      }
      room.currentOccupants.push({ student: student._id, assignedAt: new Date() });
      await room.save({ session });
    } else {
      logger.warn(
        `BookingService.approve: no Room doc for hostel=${request.hostel} ` +
        `roomNumber=${request.roomNumber}. Continuing without Room assignment.`
      );
    }

    // ── 5. Decrement hostel availability ────────────────────────────────────
    hostel.availableRooms = Math.max(0, hostel.availableRooms - 1);
    await hostel.save({ session });

    // ── 6. Approve request ───────────────────────────────────────────────────
    request.status = "Approved";
    await request.save({ session });

    // ── 7. Update student placement ──────────────────────────────────────────
    student.currentHostel = request.hostel;
    student.roomNumber     = request.roomNumber ? String(request.roomNumber) : null;
    student.currentRoom    = room ? room._id : null;
    student.currentOwner   = request.owner;
    student.status         = "Active";
    student.checkInDate    = new Date();
    await student.save({ session });

    // ── 8. Create the Booking contract ───────────────────────────────────────
    const [booking] = await Booking.create([{
      student:        student._id,
      hostel:         request.hostel,
      room:           room?._id,
      owner:          request.owner,
      bookingRequest: request._id,
      startDate:      new Date(),
      monthlyRent:    hostel.pricePerMonth || 0,
      status:         "active",
    }], { session });

    student.activeBooking = booking._id;
    await student.save({ session });

    await session.commitTransaction();
    logger.info(`BookingService.approve: requestId=${requestId} studentId=${student._id} bookingId=${booking._id}`);

    // ── Post-commit side effects (non-blocking) ──────────────────────────────
    _postApprove({ student, hostel, request, io }).catch((e) =>
      logger.warn("BookingService.approve post-commit side effects failed: " + e.message)
    );

    return { student, booking };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

/**
 * Reject a Booking Request.
 *
 * @param {string} requestId
 * @param {string} ownerId
 * @param {string} [reason]
 * @param {object} io
 */
async function reject(requestId, ownerId, reason, io) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await BookingRequest.findOne({
      _id:   requestId,
      owner: ownerId,
    }).session(session);

    if (!request) throw new AppError(404, "Request not found.");
    if (request.status !== "Pending") {
      throw new AppError(400, `Request already ${request.status.toLowerCase()}.`);
    }

    request.status = "Rejected";
    if (reason) request.rejectionReason = reason;
    await request.save({ session });

    await Student.findByIdAndUpdate(
      request.student,
      { status: "Searching" },
      { session }
    );

    await session.commitTransaction();
    logger.info(`BookingService.reject: requestId=${requestId}`);

    // Post-commit notifications (non-blocking)
    _postReject({ request, reason, io }).catch((e) =>
      logger.warn("BookingService.reject post-commit side effects failed: " + e.message)
    );
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE — Post-commit side effects (notifications, emails, socket events)
// These run after the DB transaction commits so they never roll it back.
// ─────────────────────────────────────────────────────────────────────────────

async function _postApprove({ student, hostel, request, io }) {
  // Real-time room availability
  io?.to(`hostel:${request.hostel}`).emit("room:availability_changed", {
    hostelId:       request.hostel,
    availableRooms: hostel.availableRooms,
  });

  // In-app notification
  const Notification = require("../models/Notification");
  await Notification.create({
    recipientStudent: student._id,
    recipientHostel:  request.hostel,
    sender:           request.owner,
    senderRole:       "owner",
    message: `Your booking is approved! Welcome to ${hostel.name}. Room ${request.roomNumber}, Floor ${request.floor}.`,
    type:    "welcome",
    isRead:  false,
  });

  const unreadCount = await Notification.countDocuments({
    recipientStudent: student._id,
    isRead: false,
  });
  io?.to(`user:${student.user}`).emit("notification:new", { unreadCount });

  // Email (via BullMQ queue — non-critical)
  try {
    const { addEmailJob } = require("../queues/emailQueue");
    const populatedStudent = await Student.findById(student._id).populate("user", "name email");
    if (addEmailJob && populatedStudent?.user) {
      await addEmailJob("booking-approved", {
        studentName:   populatedStudent.user.name,
        studentEmail:  populatedStudent.user.email,
        hostelName:    hostel.name,
        hostelAddress: hostel.address,
        roomNumber:    request.roomNumber,
        floor:         request.floor,
      });
    }
  } catch { /* email failing shouldn't surface */ }
}

async function _postReject({ request, reason, io }) {
  const Notification = require("../models/Notification");
  await Notification.create({
    recipientStudent: request.student,
    recipientHostel:  request.hostel,
    sender:           request.owner,
    senderRole:       "owner",
    message: `Your booking request was declined. ${reason ? `Reason: ${reason}` : "Please contact the hostel for more information."}`,
    type:    "alert",
    isRead:  false,
  });

  const rejectedStudent = await Student.findById(request.student).select("user");
  if (rejectedStudent?.user) {
    const unreadCount = await Notification.countDocuments({
      recipientStudent: request.student,
      isRead: false,
    });
    io?.to(`user:${rejectedStudent.user}`).emit("notification:new", { unreadCount });
  }

  // Email
  try {
    const { addEmailJob } = require("../queues/emailQueue");
    const s = await Student.findById(request.student).populate("user", "name email");
    const h = await Hostel.findById(request.hostel).select("name");
    if (addEmailJob && s?.user) {
      await addEmailJob("booking-rejected", {
        studentName:  s.user.name,
        studentEmail: s.user.email,
        hostelName:   h?.name || "the hostel",
        reason:       reason || "",
      });
    }
  } catch { /* non-critical */ }
}

module.exports = { createRequest, cancelRequest, approve, reject };
