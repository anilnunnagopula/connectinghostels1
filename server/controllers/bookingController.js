const BookingRequest = require("../models/BookingRequest");
const Student = require("../models/Student");

exports.getOwnerBookingRequests = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const requests = await BookingRequest.find({
      owner: ownerId,
      status: "Pending",
    })
      .populate("student", "name")
      .populate("hostel", "name");

    res.status(200).json({ requests });
  } catch (err) {
    console.error("Error fetching booking requests:", err);
    res.status(500).json({ message: "Failed to fetch booking requests." });
  }
};

exports.approveBookingRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await BookingRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Booking request not found." });
    }

    request.status = "Approved";
    await request.save();

    // You would also update the corresponding student document here
    // e.g. await Student.findByIdAndUpdate(request.student, { assignedRoom: request.roomNumber });

    res.status(200).json({ message: "Booking request approved." });
  } catch (err) {
    console.error("Error approving booking request:", err);
    res.status(500).json({ message: "Failed to approve booking request." });
  }
};

exports.rejectBookingRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await BookingRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Booking request not found." });
    }

    request.status = "Rejected";
    await request.save();

    res.status(200).json({ message: "Booking request rejected." });
  } catch (err) {
    console.error("Error rejecting booking request:", err);
    res.status(500).json({ message: "Failed to reject booking request." });
  }
};
