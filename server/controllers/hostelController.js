const Hostel = require("../models/Hostel");

// ================= OWNER CONTROLLERS =================

// ADD HOSTEL (OWNER)
exports.addHostel = async (req, res) => {
  try {
    const images =
      req.files && req.files.images
        ? req.files.images.map((file) => file.path)
        : [];

    const totalRooms = Number(req.body.totalRooms);

    if (isNaN(totalRooms)) {
      return res.status(400).json({
        message: "totalRooms must be a number",
      });
    }

    const hostel = new Hostel({
      ownerId: req.user.id,
      name: req.body.name,
      address: req.body.address,
      locality: req.body.locality,
      type: req.body.category,
      totalRooms: totalRooms,
      availableRooms: totalRooms, // ✅ REQUIRED
      pricePerMonth: Number(req.body.pricePerMonth),
      amenities: req.body.amenities ? req.body.amenities.split(",") : [],
      description: req.body.description,
      contactNumber: req.body.contactNumber,
      images,
      isActive: true,
    });

    await hostel.save();

    res.status(201).json({
      message: "Hostel added successfully ✅",
      hostel,
    });
  } catch (err) {
    console.error("🔥 ADD HOSTEL ERROR:", err);
    res.status(500).json({
      message: "Failed to add hostel",
      error: err.message,
    });
  }
};

// GET OWNER HOSTELS
exports.getMyHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ ownerId: req.user.id })
      .select("-video")
      .sort({ createdAt: -1 });

    res.status(200).json({ hostels });
  } catch (err) {
    console.error("Error fetching owner's hostels:", err);
    res.status(500).json({
      message: "Failed to fetch hostels",
    });
  }
};

// GET SINGLE HOSTEL (OWNER)
exports.getOwnerHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    }).select("-video");

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found or unauthorized",
      });
    }

    res.status(200).json({ hostel });
  } catch (err) {
    console.error("Error fetching hostel details:", err);
    res.status(500).json({
      message: "Failed to fetch hostel details",
      error: err.message,
    });
  }
};

// ================= PUBLIC CONTROLLERS =================

// GET ALL PUBLIC HOSTELS
exports.getAllPublicHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ isActive: true })
      .select("-owner -video")
      .sort({ createdAt: -1 });

    res.status(200).json(hostels);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch hostels",
      error: err.message,
    });
  }
};

// GET SINGLE PUBLIC HOSTEL
exports.getPublicHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).select("-owner -video");

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    res.status(200).json(hostel);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch hostel",
      error: err.message,
    });
  }
};
