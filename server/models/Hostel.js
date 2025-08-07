const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contact: {
      // ADDED
      type: String,
      required: true,
    },
    rooms: {
      // ADDED
      type: Number,
      required: true,
    },
    facilities: {
      // ADDED
      type: String,
      required: true,
    },
    location: String,
    type: {
      type: String, // Matches frontend 'category'
      enum: ["Boys", "Girls", "Co-Live"], // Fixed 'Co-Living' to 'Co-Live'
      default: "Boys",
    },
    price: String, // Consider adding 'required: true' if needed
    description: String,
    images: [String],
    video: String, // ADDED for video file path
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hostel", hostelSchema);
