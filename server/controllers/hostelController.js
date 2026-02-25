const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const { getFilePath } = require("../storage/storageAdapter");
const { invalidateCache } = require("../middleware/cache");
const logger = require("../middleware/logger");

// Build room docs for one floor (used in auto-generation on hostel create)
function buildFloorRooms(hostelId, floorNumber, prefix, count, capacity) {
  return Array.from({ length: count }, (_, i) => ({
    hostel: hostelId,
    floor: floorNumber,
    roomNumber: `${prefix}${String(i + 1).padStart(2, "0")}`,
    capacity: capacity || 2,
    status: "available",
    currentOccupants: [],
    occupancyCount: 0,
  }));
}

// ================= OWNER CONTROLLERS =================

// ADD HOSTEL (OWNER)
exports.addHostel = async (req, res) => {
  const images =
    req.files && req.files.images
      ? req.files.images.map(getFilePath)
      : [];

  const totalRooms = Number(req.body.totalRooms);
  const numFloors = Math.max(1, Number(req.body.floors) || 1);
  const roomsPerFloor = Math.ceil(totalRooms / numFloors);

  if (isNaN(totalRooms) || totalRooms < 1) {
    return res.status(400).json({ message: "totalRooms must be a positive number" });
  }

  const lat = parseFloat(req.body.lat);
  const lng = parseFloat(req.body.lng);

  // Build floor config for auto-generation
  const floorConfig = Array.from({ length: numFloors }, (_, i) => {
    const floorNum = i + 1;
    // Rooms on last floor = remainder if totalRooms not evenly divisible
    const count = floorNum === numFloors ? totalRooms - roomsPerFloor * (numFloors - 1) : roomsPerFloor;
    return {
      floorNumber: floorNum,
      label: floorNum === 1 && numFloors > 1 ? "Ground Floor" : `Floor ${floorNum}`,
      prefix: String(floorNum),
      roomCount: count,
    };
  });

  const hostel = new Hostel({
    ownerId: req.user.id,
    name: req.body.name,
    address: req.body.address,
    locality: req.body.locality,
    type: req.body.type,
    floors: numFloors,
    totalRooms,
    availableRooms: totalRooms,
    pricePerMonth: Number(req.body.pricePerMonth),
    amenities: req.body.amenities ? req.body.amenities.split(",") : [],
    description: req.body.description,
    contactNumber: req.body.contactNumber,
    coordinates: (!isNaN(lat) && !isNaN(lng)) ? { lat, lng } : undefined,
    images,
    floorConfig,
    isActive: false,
  });

  await hostel.save();

  // Auto-generate rooms
  const allRooms = [];
  for (const fc of floorConfig) {
    const rooms = buildFloorRooms(hostel._id, fc.floorNumber, fc.prefix, fc.roomCount, 2);
    allRooms.push(...rooms);
  }

  if (allRooms.length > 0) {
    await Room.insertMany(allRooms);
  }

  res.status(201).json({
    message: "Hostel submitted for review. It will go live once approved by an admin.",
    hostel,
    roomsGenerated: allRooms.length,
  });
};

// GET OWNER HOSTELS
exports.getMyHostels = async (req, res) => {
  const hostels = await Hostel.find({ ownerId: req.user.id })
    .select("-video")
    .sort({ createdAt: -1 });

  res.status(200).json({ hostels });
};

// GET SINGLE HOSTEL (OWNER)
exports.getOwnerHostelById = async (req, res) => {
  const hostel = await Hostel.findOne({
    _id: req.params.id,
    ownerId: req.user.id,
  }).select("-video");

  if (!hostel) {
    return res.status(404).json({ message: "Hostel not found or unauthorized" });
  }

  res.status(200).json({ hostel });
};

// UPDATE HOSTEL (OWNER)
exports.updateHostel = async (req, res) => {
  const hostel = await Hostel.findOne({
    _id: req.params.id,
    ownerId: req.user.id,
  });

  if (!hostel) {
    return res.status(404).json({ message: "Hostel not found or unauthorized" });
  }

  const allowed = ["name", "address", "locality", "contactNumber", "description", "pricePerMonth", "amenities"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      hostel[field] = req.body[field];
    }
  });

  await hostel.save();
  await invalidateCache("/api/hostels*");

  res.json({ message: "Hostel updated", hostel });
};

// ================= PUBLIC CONTROLLERS =================

/**
 * GET /api/hostels
 * Public hostel listing with server-side filtering and pagination.
 *
 * Query params:
 *   page, limit          — pagination (default: page=1, limit=20, max=50)
 *   type                 — "Boys" | "Girls" | "Co-Live"
 *   locality             — e.g. "Mangalpally"
 *   minPrice, maxPrice   — price range filter
 *   search               — partial name match (case-insensitive)
 *
 * Response: { hostels, pagination: { page, limit, total, pages } }
 */
exports.getAllPublicHostels = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const filter = { isActive: true };
  if (req.query.type) filter.type = req.query.type;
  if (req.query.locality) filter.locality = req.query.locality;
  if (req.query.search) filter.name = { $regex: req.query.search, $options: "i" };
  if (req.query.minPrice || req.query.maxPrice) {
    filter.pricePerMonth = {};
    if (req.query.minPrice) filter.pricePerMonth.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.pricePerMonth.$lte = Number(req.query.maxPrice);
  }

  const [hostels, total] = await Promise.all([
    Hostel.find(filter)
      .select("-video")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Hostel.countDocuments(filter),
  ]);

  res.status(200).json({
    hostels,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

// GET SINGLE PUBLIC HOSTEL
exports.getPublicHostelById = async (req, res) => {
  const hostel = await Hostel.findById(req.params.id).select("-video");

  if (!hostel) {
    return res.status(404).json({ message: "Hostel not found" });
  }

  res.status(200).json(hostel);
};
