const Hostel = require("../models/Hostel");
const { getFilePath } = require("../storage/storageAdapter");
const { invalidateCache } = require("../middleware/cache");
const logger = require("../middleware/logger");

// ================= OWNER CONTROLLERS =================

// ADD HOSTEL (OWNER)
exports.addHostel = async (req, res) => {
  const images =
    req.files && req.files.images
      ? req.files.images.map(getFilePath)
      : [];

  const totalRooms = Number(req.body.totalRooms);

  if (isNaN(totalRooms)) {
    return res.status(400).json({ message: "totalRooms must be a number" });
  }

  const hostel = new Hostel({
    ownerId: req.user.id,
    name: req.body.name,
    address: req.body.address,
    locality: req.body.locality,
    type: req.body.category,
    totalRooms: totalRooms,
    availableRooms: totalRooms,
    pricePerMonth: Number(req.body.pricePerMonth),
    amenities: req.body.amenities ? req.body.amenities.split(",") : [],
    description: req.body.description,
    contactNumber: req.body.contactNumber,
    images,
    isActive: true,
  });

  await hostel.save();

  // Bust public hostel listing cache so new hostel appears immediately
  await invalidateCache("/api/hostels*");

  res.status(201).json({ message: "Hostel added successfully", hostel });
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
