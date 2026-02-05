const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: {
      // Link to the main Auth User
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    // THE STATE CONTROLLERS
    currentHostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      default: null, // Null means they are "Searching"
    },
    roomNumber: { type: Number, default: null },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["Searching", "Pending Approval", "Active", "Vacated"],
      default: "Searching",
    },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", studentSchema);
