const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: String,
    type: {
      type: String, // Boys, Girls, Co-Live
      enum: ["Boys", "Girls", "Co-Living"],
      default: "Boys",
    },
    price: String,
    description: String,
    images: [String],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hostel", hostelSchema);
