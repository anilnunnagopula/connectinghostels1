const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rule", ruleSchema);
