const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    // ✅ NEW FIELDS to match frontend
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "maintenance",
        "cleanliness",
        "noise",
        "security",
        "facilities",
        "roommate",
        "billing",
        "others",
      ],
      required: true,
    },
    // ✅ KEEP for backward compatibility
    issue: {
      type: String,
      required: false, // Make optional since we have subject + message now
    },
    // ✅ File attachments
    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Complaint", complaintSchema);
