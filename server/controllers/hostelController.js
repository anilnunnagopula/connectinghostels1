const Hostel = require("../models/Hostel");
const mongoose = require("mongoose");
const Room = require("../models/Room"); // The Room model is not used in this version

exports.addHostel = async (req, res) => {
  try {
    const images = req.files.images
      ? req.files.images.map((file) => file.path)
      : [];
    const video = req.files.video ? req.files.video[0].path : null;

    // We go back to the original logic where rooms is a number.
    const roomCount = parseInt(req.body.rooms);

    const hostel = new Hostel({
      ...req.body,
      owner: req.user.id,
      images: images,
      video: video,
      type: req.body.category,
      rooms: roomCount, // Correctly save the room count as a number
    });

    await hostel.save();

    res.status(201).json({ message: "Hostel added successfully ✅", hostel });
  } catch (err) {
    console.error("Add hostel error:", err);
    res
      .status(500)
      .json({ error: "Failed to add hostel ❌", message: err.message });
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
    const hostels = await Hostel.find({ owner: ownerId }).select("-video");
    res.status(200).json({ hostels });
  } catch (err) {
    console.error("Error fetching owner's hostels:", err);
    res.status(500).json({ error: "Failed to fetch hostels" });
  }
};
