/**
 * bookingController.js — Thin HTTP adapter layer.
 *
 * All business logic lives in BookingService. Controllers:
 *  1. Extract inputs from req
 *  2. Call the service
 *  3. Return a standard response via res.ok / res.created / res.fail
 *
 * AppErrors thrown by the service propagate to the global errorHandler,
 * which maps them to the correct HTTP status code automatically.
 */

const BookingRequest = require("../models/BookingRequest");
const Student = require("../models/Student");
const logger = require("../middleware/logger");
const BookingService = require("../services/BookingService");

// ============================================================================
// STUDENT ACTIONS
// ============================================================================

/**
 * Create Booking Request (Student)
 * @route POST /api/students/booking-request
 */
exports.createBookingRequest = async (req, res) => {
  const { hostelId, floor, roomNumber, roomId } = req.body;
  const io = req.app?.locals?.io;

  const { request } = await BookingService.createRequest(
    req.user.id,
    req.user,
    { hostelId, floor, roomNumber, roomId },
    io
  );

  return res.created({
    message: "Request sent successfully! The owner will review it soon.",
    request: {
      id:         request._id,
      hostelId:   request.hostel,
      floor:      request.floor,
      roomNumber: request.roomNumber,
      status:     request.status,
      createdAt:  request.createdAt,
    },
  });
};

/**
 * Get Student's Own Requests
 * @route GET /api/students/my-requests
 */
exports.getStudentRequests = async (req, res) => {
  const userId = req.user.id;

  const students = await Student.find({ user: userId }).sort({ createdAt: -1 });

  if (!students || students.length === 0) {
    return res.ok({
      requests:      [],
      studentStatus: "No Profile",
      currentHostel: null,
    });
  }

  const primaryStudent = students[0];
  const studentIds     = students.map((s) => s._id);

  const requests = await BookingRequest.find({ student: { $in: studentIds } })
    .populate("hostel", "name location type price")
    .sort({ createdAt: -1 });

  return res.ok({
    requests,
    studentStatus: primaryStudent.status,
    currentHostel: primaryStudent.currentHostel,
  });
};

/**
 * Cancel Pending Request (Student)
 * @route DELETE /api/students/booking-request/:requestId
 */
exports.cancelBookingRequest = async (req, res) => {
  await BookingService.cancelRequest(req.params.requestId, req.user.id);
  return res.ok({ message: "Request cancelled successfully." });
};

// ============================================================================
// OWNER ACTIONS
// ============================================================================

/**
 * Get All Pending Requests for Owner
 * @route GET /api/owner/booking-requests/mine
 */
exports.getOwnerBookingRequests = async (req, res) => {
  const ownerId = req.user.id;

  const requests = await BookingRequest.find({ owner: ownerId, status: "Pending" })
    .populate({ path: "student", populate: { path: "user", select: "name email phone" } })
    .populate("hostel", "name location")
    .sort({ createdAt: -1 });

  return res.ok({ requests, count: requests.length });
};

/**
 * Approve Booking Request (Owner)
 * @route POST /api/owner/booking-requests/:requestId/approve
 */
exports.approveBookingRequest = async (req, res) => {
  const io = req.app?.locals?.io;

  const { student, booking } = await BookingService.approve(
    req.params.requestId,
    req.user.id,
    io
  );

  logger.info(`Booking approved via controller: requestId=${req.params.requestId}`);

  return res.ok({
    message: "Student successfully admitted to hostel.",
    student: {
      hostel:     student.currentHostel,
      roomNumber: student.roomNumber,
      status:     student.status,
    },
    bookingId: booking._id,
  });
};

/**
 * Reject Booking Request (Owner)
 * @route POST /api/owner/booking-requests/:requestId/reject
 */
exports.rejectBookingRequest = async (req, res) => {
  const { reason } = req.body;
  const io = req.app?.locals?.io;

  await BookingService.reject(req.params.requestId, req.user.id, reason, io);

  logger.info(`Booking rejected via controller: requestId=${req.params.requestId}`);

  return res.ok({
    message: "Request rejected.",
    reason:  reason || "No reason provided",
  });
};

module.exports = exports;
