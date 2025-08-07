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
    // ✅ The 'rooms' field is now an array of references to the Room model
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
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
