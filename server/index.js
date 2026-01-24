const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://connectinghostels1.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================== PHASE 1 ROUTES (ACTIVE) ====================
const authRoutes = require("./routes/authRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const contactRoutes = require("./routes/contact");
const otpRoutes = require("./routes/otpRoutes");

// Mount Phase 1 routes
app.use("/api/auth", authRoutes);
app.use("/api/hostels", hostelRoutes); // Public hostel browsing
app.use("/api/contact", contactRoutes);
app.use("/api/otp", otpRoutes); // Optional - forgot password

// ==================== PHASE 2 ROUTES (FROZEN) ====================
// Uncomment when Phase 2 development starts
/*
const studentRoutes = require("./routes/studentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const alertRoutes = require("./routes/alertRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const roomRoutes = require("./routes/roomRoutes");
const ruleRoutes = require("./routes/ruleRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ownerPaymentRoutes = require("./routes/ownerPaymentRoutes");

app.use("/api/student", studentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/owner/rooms", roomRoutes);
app.use("/api/owner/rules", ruleRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/owner/payments", ownerPaymentRoutes);
*/

// ==================== DATABASE & SERVER ====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Phase 1 Active - Auth, Hostels, Contact`);
  console.log(`⏸️  Phase 2 Frozen - Payments, Bookings, Complaints`);
});
