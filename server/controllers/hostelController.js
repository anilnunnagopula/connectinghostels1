const Hostel = require("../models/Hostel");

exports.addHostel = async (req, res) => {
  try {
    // Get the file paths from multer
    const images = req.files.images
      ? req.files.images.map((file) => file.path)
      : [];
    const video = req.files.video ? req.files.video[0].path : null; // Combine form data with file paths

    const hostelData = {
      ...req.body,
      owner: req.user.id,
      images: images,
      video: video,
      type: req.body.category, // Map frontend 'category' to backend 'type'
      rooms: parseInt(req.body.rooms), // Ensure rooms is a number
    };

    const hostel = new Hostel(hostelData);
    await hostel.save();
    res.status(201).json({ message: "Hostel added successfully ✅", hostel });
  } catch (err) {
    console.error("Add hostel error:", err);
    res.status(500).json({ error: "Failed to add hostel ❌" });
  }
};

exports.getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find().populate("owner", "name email");
    res.status(200).json(hostels);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hostels" });
  }
};
exports.getMyHostels = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const hostels = await Hostel.find({ owner: ownerId }).select("-video"); // Fetch hostels for the owner
    res.status(200).json({ hostels });
  } catch (err) {
    console.error("Error fetching owner's hostels:", err);
    res.status(500).json({ error: "Failed to fetch hostels" });
  }
};
