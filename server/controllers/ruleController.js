const Rule = require("../models/Rule");
const Hostel = require("../models/Hostel"); // Import Hostel model

exports.getOwnerRules = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const rules = await Rule.find({ ownerId });
    res.status(200).json({ rules });
  } catch (err) {
    console.error("Error fetching owner's rules:", err);
    res.status(500).json({ message: "Failed to fetch rules." });
  }
};

exports.addRule = async (req, res) => {
  try {
    const { text, hostelId } = req.body;
    const ownerId = req.user.id;
    if (!text || !hostelId) {
      return res
        .status(400)
        .json({ message: "Rule text and hostel ID are required." });
    }
    const newRule = new Rule({ text, hostelId, ownerId });
    await newRule.save();
    res.status(201).json({ message: "Rule added successfully", rule: newRule });
  } catch (err) {
    console.error("Error adding rule:", err);
    res.status(500).json({ message: "Failed to add rule." });
  }
};

exports.updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Rule text is required." });
    }
    const updatedRule = await Rule.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );
    if (!updatedRule) {
      return res.status(404).json({ message: "Rule not found." });
    }
    res
      .status(200)
      .json({ message: "Rule updated successfully", rule: updatedRule });
  } catch (err) {
    console.error("Error updating rule:", err);
    res.status(500).json({ message: "Failed to update rule." });
  }
};

exports.deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRule = await Rule.findByIdAndDelete(id);
    if (!deletedRule) {
      return res.status(404).json({ message: "Rule not found." });
    }
    res.status(200).json({ message: "Rule deleted successfully" });
  } catch (err) {
    console.error("Error deleting rule:", err);
    res.status(500).json({ message: "Failed to delete rule." });
  }
};

// ✅ NEW: Function to add a rule to all hostels
exports.bulkAddRule = async (req, res) => {
  try {
    const { text } = req.body;
    const ownerId = req.user.id;
    if (!text) {
      return res.status(400).json({ message: "Rule text is required." });
    }

    const hostels = await Hostel.find({ owner: ownerId });
    if (hostels.length === 0) {
      return res
        .status(404)
        .json({ message: "No hostels found for this owner." });
    }

    const rules = hostels.map((hostel) => ({
      text,
      hostelId: hostel._id,
      ownerId,
    }));

    await Rule.insertMany(rules);

    res
      .status(201)
      .json({ message: "Rules added to all hostels successfully." });
  } catch (err) {
    console.error("Error adding bulk rules:", err);
    res.status(500).json({ message: "Failed to add bulk rules." });
  }
};
// ✅ NEW: Get rules for a specific hostel (Accessible by Students)
exports.getHostelRules = async (req, res) => {
  try {
    const { hostelId } = req.params;
    
    if (!hostelId) {
      return res.status(400).json({ message: "Hostel ID is required." });
    }

    const rules = await Rule.find({ hostelId });
    res.status(200).json({ rules });
  } catch (err) {
    console.error("Error fetching hostel rules:", err);
    res.status(500).json({ message: "Failed to fetch rules for this hostel." });
  }
};