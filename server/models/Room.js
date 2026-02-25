const mongoose = require("mongoose");

const occupantSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    assignedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
      index: true,
    },
    // Floor number: 0 = Ground, 1 = 1st Floor, 2 = 2nd Floor, etc.
    floor: {
      type: Number,
      required: true,
      min: 0,
    },
    // Human-readable room number: "101", "G1", "1A", "502", etc.
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    roomType: {
      type: String,
      enum: ["single", "double", "triple", "dormitory"],
      default: "double",
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
      default: 2,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance", "reserved"],
      default: "available",
      index: true,
    },
    // Embedded current occupants for fast occupancy checks
    currentOccupants: [occupantSchema],
    // Denormalized count for fast aggregation queries
    occupancyCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    amenities: [{ type: String, trim: true }],
    notes: { type: String, trim: true, default: "" },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Unique room number per hostel — partial index allows soft-deleted numbers to be reused
roomSchema.index(
  { hostel: 1, roomNumber: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

// Performance indexes
roomSchema.index({ hostel: 1, floor: 1 });
roomSchema.index({ hostel: 1, status: 1 });

// Soft-delete filter: exclude deleted rooms from all finds by default
roomSchema.pre(/^find/, function (next) {
  if (!Object.prototype.hasOwnProperty.call(this.getQuery(), "isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

// Keep occupancyCount in sync and auto-manage status
roomSchema.pre("save", function (next) {
  this.occupancyCount = this.currentOccupants.length;
  if (this.occupancyCount >= this.capacity && this.status !== "maintenance") {
    this.status = "occupied";
  } else if (this.occupancyCount === 0 && this.status === "occupied") {
    this.status = "available";
  }
  next();
});

module.exports = mongoose.model("Room", roomSchema);
