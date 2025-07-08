// server/controllers/sendOTP.js
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // 🔥 6-digit OTP

  try {
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      to: `+91${phone}`, // change country code if needed
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    // Ideally store OTP temporarily in DB or memory (like Redis)
    console.log(`OTP ${otp} sent to ${phone}`);

    res.status(200).json({ message: "OTP sent successfully ✅" });
  } catch (err) {
    console.error("Twilio error:", err);
    res.status(500).json({ error: "Failed to send OTP. Try again later." });
  }
};
