// server/controllers/authController.js
const User = require("../models/User"); // Adjust path as needed
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const client = require("twilio")(accountSid, authToken);
// Register user (Student or Owner)
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
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Login
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

    const token = jwt.sign({ id: user._id, role: user.role }, "secretKey", {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

// Send OTP 
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit
    // Save it temporarily (Redis recommended, or DB)
    await client.messages.create({
      body: `Your OTP for Registering as Hostel owner in ConnectingHostels is ${otp} Thank you for registering in ConnectingHostels`,
      from: "+Your_Twilio_Number",
      to: phone,
    });

    res.status(200).json({ message: "OTP sent!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "OTP failed to send" });
  }
};

// Verify OTP (dummy)
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  if (!otp) return res.status(400).json({ error: "OTP is required" });

  // Placeholder logic
  res.status(200).json({ message: "OTP verified" });
};
