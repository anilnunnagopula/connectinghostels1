const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
    required: true,
  },
  roomNumber: String,
  capacity: Number,
  price: Number,
  isAvailable: {
    type: Boolean,
    default: true,
  },
  // Add more fields as needed!
});

module.exports = mongoose.model("Room", roomSchema);
