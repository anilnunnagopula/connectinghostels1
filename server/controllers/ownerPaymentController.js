const OwnerPayment = require("../models/OwnerPayment");
// Assume you also have a Payment model for history
const Payment = require("../models/Payment");

exports.getPaymentSettings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const settings = await OwnerPayment.findOne({ owner: ownerId });

    res.status(200).json({ settings });
  } catch (err) {
    console.error("Error fetching owner payment settings:", err);
    res.status(500).json({ message: "Failed to fetch settings." });
  }
};

exports.savePaymentSettings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { bankDetails, upiId } = req.body;

    const updatedSettings = await OwnerPayment.findOneAndUpdate(
      { owner: ownerId },
      { bankDetails, upiId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res
      .status(200)
      .json({
        message: "Payment settings saved successfully.",
        settings: updatedSettings,
      });
  } catch (err) {
    console.error("Error saving owner payment settings:", err);
    res.status(500).json({ message: "Failed to save settings." });
  }
};

// ✅ NEW: Controller function to get payout methods
exports.getPayoutMethods = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const settings = await OwnerPayment.findOne({ owner: ownerId });

    if (!settings) {
      return res.status(404).json({ message: "Payment methods not found." });
    }

    res.status(200).json({
      bankDetails: settings.bankDetails,
      upiId: settings.upiId,
    });
  } catch (err) {
    console.error("Error fetching payout methods:", err);
    res.status(500).json({ message: "Failed to fetch payout methods." });
  }
};

// ✅ NEW: Controller function to get payout history
exports.getPayoutHistory = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const history = await Payment.find({ owner: ownerId }).sort({ paidAt: -1 });

    res.status(200).json({ history });
  } catch (err) {
    console.error("Error fetching payout history:", err);
    res.status(500).json({ message: "Failed to fetch payout history." });
  }
};
