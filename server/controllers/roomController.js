const mongoose = require("mongoose");
const Room = require("../models/Room");
const Hostel = require("../models/Hostel");
const logger = require("../middleware/logger");
const RoomService = require("../services/RoomService");

// Imported from RoomService so generateRooms / addFloor / deleteFloor can reuse them
const { assertHostelOwner, syncHostelCounts } = RoomService;



// ─── Helper: build room number from floor prefix + sequential index ───────────
function buildRoomNumber(prefix, index) {
  const padded = String(index).padStart(2, "0");
  return `${prefix}${padded}`;
}

// ─── Helper: build rooms array for one floor ──────────────────────────────────
function buildRoomsForFloor(hostelId, floorNumber, prefix, count, defaultCapacity) {
  return Array.from({ length: count }, (_, i) => ({
    hostel: hostelId,
    floor: floorNumber,
    roomNumber: buildRoomNumber(prefix, i + 1),
    capacity: defaultCapacity || 2,
    status: "available",
    currentOccupants: [],
    occupancyCount: 0,
  }));
}



// ─────────────────────────────────────────────────────────────────────────────
// GET /api/owner/rooms?hostelId=:id[&floor=:n][&status=:s]
// ─────────────────────────────────────────────────────────────────────────────
exports.getRooms = async (req, res) => {
  const { hostelId, floor, status } = req.query;
  if (!hostelId) return res.status(400).json({ message: "hostelId is required" });

  await assertHostelOwner(hostelId, req.user.id);

  const filter = { hostel: hostelId };
  if (floor !== undefined) filter.floor = Number(floor);
  if (status) filter.status = status;

  const rooms = await Room.find(filter)
    .populate("currentOccupants.student", "name email phone")
    .sort({ floor: 1, roomNumber: 1 });

  res.json({ rooms });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/owner/rooms/summary?hostelId=:id
// ─────────────────────────────────────────────────────────────────────────────
exports.getFloorSummary = async (req, res) => {
  const { hostelId } = req.query;
  if (!hostelId) return res.status(400).json({ message: "hostelId is required" });

  await assertHostelOwner(hostelId, req.user.id);

  const summary = await Room.aggregate([
    {
      $match: {
        hostel: new mongoose.Types.ObjectId(hostelId),
        isDeleted: { $ne: true },
      },
    },
    {
      $group: {
        _id: "$floor",
        total: { $sum: 1 },
        available: { $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] } },
        occupied: { $sum: { $cond: [{ $eq: ["$status", "occupied"] }, 1, 0] } },
        maintenance: { $sum: { $cond: [{ $eq: ["$status", "maintenance"] }, 1, 0] } },
        reserved: { $sum: { $cond: [{ $eq: ["$status", "reserved"] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ summary });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/owner/rooms — add a single room
// ─────────────────────────────────────────────────────────────────────────────
exports.addRoom = async (req, res) => {
  const room = await RoomService.addRoom(req.body.hostelId, req.body, req.user.id);
  return res.created({ room });
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/owner/rooms/:id — update room details
// ─────────────────────────────────────────────────────────────────────────────
exports.updateRoom = async (req, res) => {
  const room = await RoomService.updateRoom(req.params.id, req.body, req.user.id);
  return res.ok({ room });
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/owner/rooms/:id/status
// ─────────────────────────────────────────────────────────────────────────────
exports.updateRoomStatus = async (req, res) => {
  const room = await RoomService.updateStatus(req.params.id, req.body.status, req.user.id);
  return res.ok({ room });
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/owner/rooms/:id — soft delete
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteRoom = async (req, res) => {
  await RoomService.deleteRoom(req.params.id, req.user.id);
  return res.ok({ message: "Room deleted" });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/owner/rooms/bulk — bulk status update
// body: { roomIds: [...], status: "maintenance"|"available"|"reserved" }
// ─────────────────────────────────────────────────────────────────────────────
exports.bulkUpdateStatus = async (req, res) => {
  const { roomIds, status } = req.body;
  const VALID = ["available", "maintenance", "reserved"];

  if (!Array.isArray(roomIds) || roomIds.length === 0) {
    return res.status(400).json({ message: "roomIds must be a non-empty array" });
  }
  if (!VALID.includes(status)) {
    return res.status(400).json({ message: `Bulk status must be one of: ${VALID.join(", ")}` });
  }

  const rooms = await Room.find({ _id: { $in: roomIds } });
  const hostelIds = [...new Set(rooms.map((r) => r.hostel.toString()))];

  for (const hid of hostelIds) {
    await assertHostelOwner(hid, req.user.id);
  }

  if (status === "available") {
    const blocked = rooms.filter((r) => r.occupancyCount > 0);
    if (blocked.length > 0) {
      return res.status(409).json({
        message: `${blocked.length} room(s) have occupants and cannot be set to available`,
        rooms: blocked.map((r) => r.roomNumber),
      });
    }
  }

  await Room.updateMany({ _id: { $in: roomIds } }, { $set: { status } });

  for (const hid of hostelIds) {
    await syncHostelCounts(hid);
  }

  return res.ok({ message: `${roomIds.length} rooms updated to "${status}"` });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/owner/hostels/:hostelId/generate-rooms
// Safe re-run: only creates rooms that don't exist yet
// body: { floors: [{ floorNumber, prefix, label, roomCount, defaultCapacity }] }
// ─────────────────────────────────────────────────────────────────────────────
exports.generateRooms = async (req, res) => {
  const { hostelId } = req.params;
  const hostel = await assertHostelOwner(hostelId, req.user.id);

  const { floors } = req.body;
  if (!Array.isArray(floors) || floors.length === 0) {
    return res.status(400).json({ message: "floors array is required" });
  }

  let createdCount = 0;
  let skippedCount = 0;

  for (const fc of floors) {
    if (fc.floorNumber === undefined || !fc.roomCount) {
      return res.status(400).json({ message: "Each floor needs floorNumber and roomCount" });
    }

    const prefix = fc.prefix || String(fc.floorNumber);
    const rooms = buildRoomsForFloor(hostelId, fc.floorNumber, prefix, fc.roomCount, fc.defaultCapacity);

    for (const roomData of rooms) {
      const exists = await Room.findOne({ hostel: hostelId, roomNumber: roomData.roomNumber });
      if (exists) { skippedCount++; continue; }
      await Room.create(roomData);
      createdCount++;
    }
  }

  // Merge floorConfig
  const newFloorNums = new Set(floors.map((f) => f.floorNumber));
  const merged = [
    ...hostel.floorConfig.filter((f) => !newFloorNums.has(f.floorNumber)).map((f) => f.toObject()),
    ...floors.map((fc) => ({
      floorNumber: fc.floorNumber,
      label: fc.label || `Floor ${fc.floorNumber}`,
      prefix: fc.prefix || String(fc.floorNumber),
      roomCount: fc.roomCount,
    })),
  ].sort((a, b) => a.floorNumber - b.floorNumber);

  await hostel.save();
  await syncHostelCounts(hostelId);

  return res.created({
    message: `Generated ${createdCount} rooms (${skippedCount} already existed)`,
    created: createdCount,
    skipped: skippedCount,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/owner/hostels/:hostelId/floors — add a new floor
// body: { floorNumber, label, prefix, roomCount, defaultCapacity }
// ─────────────────────────────────────────────────────────────────────────────
exports.addFloor = async (req, res) => {
  const { hostelId } = req.params;
  const { floorNumber, label, prefix, roomCount, defaultCapacity } = req.body;

  if (floorNumber === undefined || !roomCount) {
    return res.status(400).json({ message: "floorNumber and roomCount are required" });
  }

  const hostel = await assertHostelOwner(hostelId, req.user.id);

  const floorExists = hostel.floorConfig.some((f) => f.floorNumber === Number(floorNumber));
  if (floorExists) {
    return res.status(409).json({ message: `Floor ${floorNumber} already exists` });
  }

  const floorPrefix = prefix || String(floorNumber);
  const rooms = buildRoomsForFloor(hostelId, Number(floorNumber), floorPrefix, Number(roomCount), defaultCapacity);

  const roomNumbers = rooms.map((r) => r.roomNumber);
  const conflicts = await Room.find({ hostel: hostelId, roomNumber: { $in: roomNumbers } });
  if (conflicts.length > 0) {
    return res.status(409).json({
      message: `${conflicts.length} room number(s) already exist`,
      conflicts: conflicts.map((r) => r.roomNumber),
    });
  }

  await Room.insertMany(rooms);

  hostel.floorConfig.push({ floorNumber: Number(floorNumber), label: label || `Floor ${floorNumber}`, prefix: floorPrefix, roomCount: Number(roomCount) });
  hostel.floorConfig.sort((a, b) => a.floorNumber - b.floorNumber);
  await hostel.save();
  await syncHostelCounts(hostelId);

  return res.created({
    message: `Floor ${floorNumber} added with ${roomCount} rooms`,
    roomsCreated: rooms.length,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/owner/hostels/:hostelId/floors/:floorNumber
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteFloor = async (req, res) => {
  const { hostelId, floorNumber } = req.params;
  const floorNum = Number(floorNumber);

  const hostel = await assertHostelOwner(hostelId, req.user.id);

  const occupiedCount = await Room.countDocuments({
    hostel: hostelId,
    floor: floorNum,
    occupancyCount: { $gt: 0 },
  });

  if (occupiedCount > 0) {
    return res.status(409).json({
      message: `Cannot remove Floor ${floorNum}: ${occupiedCount} room(s) are occupied`,
    });
  }

  await Room.updateMany({ hostel: hostelId, floor: floorNum }, { $set: { isDeleted: true } });

  hostel.floorConfig = hostel.floorConfig.filter((f) => f.floorNumber !== floorNum);
  await hostel.save();
  await syncHostelCounts(hostelId);

  return res.ok({ message: `Floor ${floorNum} and all its rooms removed` });
};
