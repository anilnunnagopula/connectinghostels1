const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
    ownerReply: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    repliedAt: Date,
  },
  { timestamps: true }
);

// One review per student per hostel
reviewSchema.index({ hostel: 1, student: 1 }, { unique: true });
reviewSchema.index({ hostel: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
