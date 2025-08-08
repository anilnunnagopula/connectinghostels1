const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    // ✅ The `rooms` field is now a number to match the frontend form
    rooms: {
      type: Number,
      required: true,
    },
    facilities: {
      type: String,
      required: true,
    },
    location: String,
    type: {
      type: String, // Boys, Girls, Co-Live
      enum: ["Boys", "Girls", "Co-Live"],
      default: "Boys",
    },
    price: String,
    description: String,
    images: [String],
    video: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hostel", hostelSchema);
