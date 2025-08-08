const OwnerPayments = require("../models/OwnerPayments"); // ✅ Corrected model name
// const Payout = require("../models/Payout"); // Assume this model exists

exports.getPaymentSettings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const settings = await OwnerPayments.findOne({ owner: ownerId });

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

    const updatedSettings = await OwnerPayments.findOneAndUpdate(
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

exports.getPayoutMethods = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const settings = await OwnerPayments.findOne({ owner: ownerId });

    if (!settings) {
      return res.status(200).json({ methods: [] });
    }

    // Logic to construct the methods array
    const methods = [];
    if (settings.bankDetails && settings.bankDetails.accountNumber) {
      methods.push({
        _id: settings._id,
        type: "BANK_TRANSFER",
        isDefault: settings.bankDetails.isDefault,
        details: settings.bankDetails,
      });
    }

    if (settings.upiId) {
      methods.push({
        _id: settings._id,
        type: "UPI",
        isDefault: settings.upiId.isDefault,
        details: { upiId: settings.upiId.upiId },
      });
    }

    res.status(200).json({ methods });
  } catch (err) {
    console.error("Error fetching payout methods:", err);
    res.status(500).json({ message: "Failed to fetch payout methods." });
  }
};

exports.getPayoutHistory = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const history = await Payout.find({ owner: ownerId }).sort({
      processedAt: -1,
    });

    res.status(200).json({ history });
  } catch (err) {
    console.error("Error fetching payout history:", err);
    res.status(500).json({ message: "Failed to fetch payout history." });
  }
};
