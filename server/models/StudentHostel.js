const mongoose = require("mongoose");

const studentHostelSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming a User model for the student
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
    roomNumber: {
      type: Number,
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Active", "Completed", "Canceled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentHostel", studentHostelSchema);
