const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 📦 Twilio Setup
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// 💾 In-memory OTP store (use Redis/DB in production)
const otpStore = {}; // { "+919999999999": { otp: "123456", expiresAt: 1234567890 } }

// ⚡ REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, hostelName } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      hostelName: role === "owner" ? hostelName : undefined,
    });

    await user.save();

    res.status(201).json({ message: "Registered successfully", role });
  } catch (err) {
    console.error("🚨 Register Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔐 LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(404).json({ error: "User not found or wrong role" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretKey",
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("🚨 Login Error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// 📲 SEND OTP
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await client.messages.create({
      body: `Your OTP for ConnectingHostels is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone.startsWith("+") ? phone : `+91${phone}`,
    });

    // Save OTP with expiry (5 mins)
    otpStore[phone] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    console.log(`✅ OTP ${otp} sent to ${phone}`);
    res.status(200).json({ message: "OTP sent successfully ✅" });
  } catch (err) {
    console.error("🚨 Twilio OTP Error:", err);
    res.status(500).json({ error: "OTP failed to send" });
  }
};

// ✅ VERIFY OTP
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone and OTP required" });
  }

  const record = otpStore[phone];
  if (!record) {
    return res.status(400).json({ error: "No OTP sent to this number" });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[phone];
    return res.status(400).json({ error: "OTP expired ⏰" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP ❌" });
  }

  delete otpStore[phone];
  return res.status(200).json({ message: "OTP verified ✅" });
};
