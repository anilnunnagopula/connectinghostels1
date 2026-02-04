const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: String,
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    room: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // You might want to add a `status` field for student's occupancy status
    status: {
        type: String,
        enum: ["Active", "Vacated", "Evicted"],
        default: "Active"
    },
    balance: {
        type: Number,
        default: 0, // > 0 means student has advance/credit, < 0 means student owes money (but usually we track dues separately, so this can be 'wallet' or just advance)
        // Alternatively, strictly track: Positive = Advance, Negative = Dues
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
