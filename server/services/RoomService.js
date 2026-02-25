/**
 * RoomService — Business logic extracted from roomController.
 *
 * Provides:
 *   - addRoom()         — create a single room, sync hostel counts, update Hostel.stats
 *   - updateRoom()      — patch room details
 *   - updateStatus()    — change room status with occupancy guard
 *   - deleteRoom()      — soft-delete with occupancy guard
 *   - syncHostelCounts() — recalculates Hostel.totalRooms / availableRooms / stats
 *
 * Throws AppError for all domain failures.
 */

const mongoose = require("mongoose");
const AppError = require("../middleware/AppError");
const Room = require("../models/Room");
const Hostel = require("../models/Hostel");

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS (also exported for use in generateRooms / addFloor)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Assert that `hostelId` belongs to `ownerId`.
 * Returns the hostel document.
 * @throws AppError 404 if not found or not owned.
 */
async function assertHostelOwner(hostelId, ownerId) {
  const hostel = await Hostel.findOne({ _id: hostelId, ownerId });
  if (!hostel) throw new AppError(404, "Hostel not found or not authorized");
  return hostel;
}

/**
 * Recalculate `Hostel.totalRooms`, `Hostel.availableRooms`, `Hostel.stats`,
 * and per-floor `floorConfig.roomCount`.
 */
async function syncHostelCounts(hostelId) {
  const hostel = await Hostel.findById(hostelId);
  if (!hostel) return;

  // Per-floor counts
  const floorCounts = await Room.aggregate([
    { $match: { hostel: new mongoose.Types.ObjectId(hostelId), isDeleted: { $ne: true } } },
    { $group: { _id: "$floor", count: { $sum: 1 } } },
  ]);

  const countMap = {};
  let total = 0;
  floorCounts.forEach(({ _id, count }) => {
    countMap[_id] = count;
    total += count;
  });

  hostel.floorConfig = hostel.floorConfig.map((fc) => ({
    ...fc.toObject(),
    roomCount: countMap[fc.floorNumber] || 0,
  }));
  hostel.totalRooms = total;

  const availCount = await Room.countDocuments({
    hostel: hostelId,
    status: "available",
    isDeleted: { $ne: true },
  });
  hostel.availableRooms = availCount;

  const occupiedCount = await Room.countDocuments({
    hostel:    hostelId,
    status:    "occupied",
    isDeleted: { $ne: true },
  });

  // Phase 1: keep Hostel.stats in sync
  hostel.stats = {
    totalRooms:     total,
    occupiedRooms:  occupiedCount,
    availableRooms: availCount,
    lastCalculatedAt: new Date(),
  };

  await hostel.save();
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC SERVICE METHODS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add a single room to a hostel.
 * @param {string} hostelId
 * @param {object} data     - { floor, roomNumber, roomType, capacity, amenities, notes, pricePerMonth }
 * @param {string} ownerId
 * @returns Room document
 */
async function addRoom(hostelId, data, ownerId) {
  await assertHostelOwner(hostelId, ownerId);

  const roomNumber = data.roomNumber.toUpperCase();

  const exists = await Room.findOne({ hostel: hostelId, roomNumber });
  if (exists) {
    throw new AppError(409, `Room "${roomNumber}" already exists in this hostel`);
  }

  const room = await Room.create({
    hostel:     hostelId,
    floor:      Number(data.floor),
    roomNumber,
    roomType:   data.roomType || "double",
    capacity:   data.capacity  ? Number(data.capacity)      : 2,
    pricePerMonth: data.pricePerMonth ? Number(data.pricePerMonth) : undefined,
    amenities:  data.amenities || [],
    notes:      data.notes     || "",
  });

  await syncHostelCounts(hostelId);
  return room;
}

/**
 * Update room fields.
 * @param {string} roomId
 * @param {object} data
 * @param {string} ownerId
 * @returns updated Room document
 */
async function updateRoom(roomId, data, ownerId) {
  const room = await Room.findById(roomId);
  if (!room) throw new AppError(404, "Room not found");

  await assertHostelOwner(room.hostel, ownerId);

  const { roomNumber, roomType, capacity, floor, amenities, notes, pricePerMonth } = data;

  if (capacity !== undefined && Number(capacity) < room.occupancyCount) {
    throw new AppError(
      422,
      `Cannot reduce capacity to ${capacity}: room has ${room.occupancyCount} occupant(s)`
    );
  }

  if (roomNumber && roomNumber.toUpperCase() !== room.roomNumber) {
    const conflict = await Room.findOne({
      hostel: room.hostel,
      roomNumber: roomNumber.toUpperCase(),
      _id: { $ne: room._id },
    });
    if (conflict) {
      throw new AppError(409, `Room "${roomNumber}" already exists in this hostel`);
    }
    room.roomNumber = roomNumber.toUpperCase();
  }

  const floorChanged = floor !== undefined && Number(floor) !== room.floor;

  if (roomType      !== undefined) room.roomType      = roomType;
  if (capacity      !== undefined) room.capacity      = Number(capacity);
  if (floor         !== undefined) room.floor         = Number(floor);
  if (amenities     !== undefined) room.amenities     = amenities;
  if (notes         !== undefined) room.notes         = notes;
  if (pricePerMonth !== undefined) room.pricePerMonth = Number(pricePerMonth);

  await room.save();
  if (floorChanged) await syncHostelCounts(room.hostel);

  return room;
}

/**
 * Update a room's status.
 * Guards against marking occupied rooms as 'available'.
 * @param {string} roomId
 * @param {string} status
 * @param {string} ownerId
 * @returns updated Room document
 */
async function updateStatus(roomId, status, ownerId) {
  const room = await Room.findById(roomId);
  if (!room) throw new AppError(404, "Room not found");

  await assertHostelOwner(room.hostel, ownerId);

  if (status === "available" && room.occupancyCount > 0) {
    throw new AppError(
      409,
      `Room has ${room.occupancyCount} occupant(s). Remove them before marking available.`
    );
  }

  room.status = status;
  await room.save();

  // Keep hostel.availableRooms + Hostel.stats in sync
  await syncHostelCounts(room.hostel);

  return room;
}

/**
 * Soft-delete a room. Fails if the room has occupants.
 * @param {string} roomId
 * @param {string} ownerId
 */
async function deleteRoom(roomId, ownerId) {
  const room = await Room.findById(roomId);
  if (!room) throw new AppError(404, "Room not found");

  await assertHostelOwner(room.hostel, ownerId);

  if (room.occupancyCount > 0) {
    throw new AppError(
      409,
      `Cannot delete "${room.roomNumber}": ${room.occupancyCount} occupant(s) assigned`
    );
  }

  room.isDeleted = true;
  await room.save();
  await syncHostelCounts(room.hostel);
}

module.exports = { addRoom, updateRoom, updateStatus, deleteRoom, syncHostelCounts, assertHostelOwner };
