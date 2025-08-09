// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // 📦 Twilio Setup
// const accountSid = process.env.TWILIO_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require("twilio")(accountSid, authToken);

// // 💾 In-memory OTP store (use Redis/DB in production)
// const otpStore = {}; // { "+919999999999": { otp: "123456", expiresAt: 1234567890 } }

// // ⚡ REGISTER USER
// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, phone, password, role, hostelName } = req.body;

//     if (!name || !email || !phone || !password || !role) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(409).json({ message: "Email already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       role,
//       hostelName: role === "owner" ? hostelName : undefined,
//     });

//     await user.save();

//     // --- FIX START ---
//     // After successful registration, immediately create a token and log the user in.
//     // This matches the expectation of the Register.jsx component.
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET || "secretKey",
//       {
//         expiresIn: "7d",
//       }
//     );

//     // Construct the user object to be sent in the response, matching frontend expectations.
//     const userPayload = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       phone: user.phone,
//       hostelName: user.hostelName,
//     };

//     res.status(201).json({
//       message: "Registered successfully",
//       token,
//       user: userPayload,
//     });
//     // --- FIX END ---
//   } catch (err) {
//     console.error("🚨 Register Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // 🔐 LOGIN USER
// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     const user = await User.findOne({ email, role });
//     if (!user) {
//       return res.status(404).json({ message: "User not found or wrong role" });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET || "secretKey",
//       {
//         expiresIn: "7d",
//       }
//     );

//     // --- FIX START ---
//     // The frontend expects a nested 'user' object in the response.
//     // This creates the expected structure.
//     const userPayload = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     };

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: userPayload, // Send the nested user object
//     });
//     // --- FIX END ---
//   } catch (err) {
//     console.error("🚨 Login Error:", err);
//     res.status(500).json({ message: "Login failed" });
//   }
// };

// // 📲 SEND OTP
// exports.sendOtp = async (req, res) => {
//   const { phone } = req.body;

//   if (!phone) {
//     return res.status(400).json({ message: "Phone number is required" });
//   }

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   try {
//     await client.messages.create({
//       body: `Your OTP for ConnectingHostels is: ${otp}`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: phone.startsWith("+") ? phone : `+91${phone}`,
//     }); // Save OTP with expiry (5 mins)

//     otpStore[phone] = {
//       otp,
//       expiresAt: Date.now() + 5 * 60 * 1000,
//     };

//     console.log(`✅ OTP ${otp} sent to ${phone}`);
//     res.status(200).json({ message: "OTP sent successfully ✅" });
//   } catch (err) {
//     console.error("🚨 Twilio OTP Error:", err);
//     res.status(500).json({ message: "OTP failed to send" });
//   }
// };

// // ✅ VERIFY OTP
// exports.verifyOtp = async (req, res) => {
//   const { phone, otp } = req.body;

//   if (!phone || !otp) {
//     return res.status(400).json({ message: "Phone and OTP required" });
//   }

//   const record = otpStore[phone];
//   if (!record) {
//     return res.status(400).json({ message: "No OTP sent to this number" });
//   }

//   if (Date.now() > record.expiresAt) {
//     delete otpStore[phone];
//     return res.status(400).json({ message: "OTP expired ⏰" });
//   }

//   if (record.otp !== otp) {
//     return res.status(400).json({ message: "Invalid OTP ❌" });
//   }

//   delete otpStore[phone];
//   return res.status(200).json({ message: "OTP verified ✅" });
// };

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
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretKey",
      {
        expiresIn: "7d",
      }
    );

    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      hostelName: user.hostelName,
    };

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: userPayload,
    });
  } catch (err) {
    console.error("🚨 Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔐 LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(404).json({ message: "User not found or wrong role" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretKey",
      {
        expiresIn: "7d",
      }
    );

    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      message: "Login successful",
      token,
      user: userPayload,
    });
  } catch (err) {
    console.error("🚨 Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// 📲 SEND OTP
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await client.messages.create({
      body: `Your OTP for ConnectingHostels is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone.startsWith("+") ? phone : `+91${phone}`,
    });

    otpStore[phone] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    console.log(`✅ OTP ${otp} sent to ${phone}`);
    res.status(200).json({ message: "OTP sent successfully ✅" });
  } catch (err) {
    console.error("🚨 Twilio OTP Error:", err);
    res.status(500).json({ message: "OTP failed to send" });
  }
};

// ✅ VERIFY OTP
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP required" });
  }

  const record = otpStore[phone];
  if (!record) {
    return res.status(400).json({ message: "No OTP sent to this number" });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[phone];
    return res.status(400).json({ message: "OTP expired ⏰" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP ❌" });
  }

  delete otpStore[phone];
  return res.status(200).json({ message: "OTP verified ✅" });
};

// ✅ NEW: Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
};

// ✅ NEW: Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Handle password change separately and securely
    if (updates.newPassword) {
      const user = await User.findById(userId);
      const isMatch = await bcrypt.compare(
        updates.currentPassword,
        user.password
      );
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password." });
      }
      updates.password = await bcrypt.hash(updates.newPassword, 10);
      delete updates.currentPassword;
      delete updates.newPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ message: "Failed to update profile." });
  }
};


