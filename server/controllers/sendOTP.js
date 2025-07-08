// const twilio = require("twilio");
// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// exports.sendOtp = async (req, res) => {
//   const { phone } = req.body;

//   if (!phone) {
//     return res.status(400).json({ error: "Phone number is required." });
//   }

//   // 🔥 Generate 6-digit OTP
//   const otp = Math.floor(100000 + Math.random() * 900000);

//   try {
//     // 🌍 If you're on Twilio free trial, only verified numbers will work
//     const message = await client.messages.create({
//       body: `🔐 Your ConnectHostels OTP is: ${otp}`,
//       from: process.env.TWILIO_PHONE_NUMBER, // This must be SMS-enabled
//       to: `+91${phone}`, // ⚠️ Change country code as needed
//     });

//     console.log(`✅ OTP ${otp} sent to +91${phone}`);
//     console.log("🧾 Message SID:", message.sid);

//     // 👉 In production, store this OTP temporarily (e.g. Redis) for verification
//     res.status(200).json({ message: "OTP sent successfully ✅" });
//   } catch (err) {
//     console.error(
//       "❌ Twilio error:",
//       err?.response?.data || err.message || err
//     );
//     res.status(500).json({
//       error:
//         "Failed to send OTP. Make sure the phone number is correct and your Twilio number is SMS-enabled.",
//     });
//   }
// };
// server/controllers/sendOtp.js

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "📱 Phone number is required" });
  }

  // ⚠️ Hardcoded OTP for dev only
  const testOTP = "123456";

  try {
    // 👇 Just log and pretend we sent it
    console.log(`📦 [DEV] Sending OTP ${testOTP} to ${phone}`);

    // You can also save this OTP somewhere temporarily if you want to verify it later
    res.status(200).json({
      message: "✅ Test OTP sent (check console)",
      otp: testOTP, // optional - you can omit this if you don’t want to show it in frontend
    });
  } catch (err) {
    console.error("❌ Error sending test OTP:", err.message);
    res.status(500).json({ error: "Failed to send OTP 😓" });
  }
};
