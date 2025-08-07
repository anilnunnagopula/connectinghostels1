const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://connectinghostels1.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const studentRoutes = require("./routes/studentRoutes");
const contactRoutes = require("./routes/contact");
const roomRoutes = require("./routes/roomRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const alertRoutes = require("./routes/alertRoutes");
const ruleRoutes = require("./routes/ruleRoutes");
const ownerDashboardRoutes = require("./routes/ownerDashboardRoutes"); // ✅ NEW: Dashboard routes

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/alerts", alertRoutes);

// ✅ UPDATED: Mount all owner-specific routes under a single /api/owner prefix
// This is the correct way to handle hierarchical routing in Express.
app.use("/api/owner", ownerDashboardRoutes); // New dedicated router for dashboard
app.use("/api/owner/hostels", hostelRoutes);
app.use("/api/owner/rooms", roomRoutes);
app.use("/api/owner/rules", ruleRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
