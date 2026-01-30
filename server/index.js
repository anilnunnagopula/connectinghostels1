const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(
  cors({
    origin: ["http://localhost:3000", "https://connectinghostels1.netlify.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================== PHASE 1 (PUBLIC + AUTH) ====================
const authRoutes = require("./routes/authRoutes");
const publicHostelRoutes = require("./routes/hostelRoutes"); // PUBLIC
const contactRoutes = require("./routes/contact");
const otpRoutes = require("./routes/otpRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/hostels", publicHostelRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/otp", otpRoutes);

// ==================== PHASE 2A (OWNER – ACTIVE) ====================
const ownerRoutes = require("./routes/ownerRoutes");
const ownerHostelRoutes = require("./routes/ownerHostelRoutes");
const roomRoutes = require("./routes/roomRoutes");
const ruleRoutes = require("./routes/ruleRoutes");
const ownerPaymentRoutes = require("./routes/ownerPaymentRoutes");

app.use("/api/owner", ownerRoutes);
app.use("/api/owner/hostels", ownerHostelRoutes);
app.use("/api/owner/rooms", roomRoutes);
app.use("/api/owner/rules", ruleRoutes);
app.use("/api/owner/payments", ownerPaymentRoutes);

// ==================== PHASE 2B (STUDENT – FROZEN) ====================
/*
const studentRoutes = require("./routes/studentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const alertRoutes = require("./routes/alertRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/student", studentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/payments", paymentRoutes);
*/

// ==================== HEALTH CHECK ====================
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

// ==================== DATABASE & SERVER ====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Phase 1 Active - Public + Auth`);
  console.log(`🏢 Phase 2A Active - Owner APIs`);
  console.log(`⏸️ Phase 2B Frozen - Student APIs`);
});
