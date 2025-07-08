const Hostel = require("../models/Hostel");

exports.addHostel = async (req, res) => {
  try {
    const hostel = new Hostel({ ...req.body, owner: req.user.id });
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
