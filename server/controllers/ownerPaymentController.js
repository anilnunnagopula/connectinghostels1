/**
 * Owner Payment Controller
 */

const OwnerPayment = require("../models/OwnerPayment");

exports.getOwnerPayments = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const payments = await OwnerPayment.find({ owner: ownerId })
      .populate("student", "name email")
      .populate("hostel", "name")
      .sort({ createdAt: -1 });

    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      success: true,
      totalEarnings,
      payments,
    });
  } catch (err) {
    console.error("Owner payments error:", err);
    res.status(500).json({ error: "Failed to fetch owner payments" });
  }
};
