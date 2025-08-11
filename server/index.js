const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://connectinghostels1.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());

// Serving static files (e.g., uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import all routers
const authRoutes = require("./routes/authRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const studentRoutes = require("./routes/studentRoutes");
const contactRoutes = require("./routes/contact");
const roomRoutes = require("./routes/roomRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const alertRoutes = require("./routes/alertRoutes");
const ruleRoutes = require("./routes/ruleRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const ownerPaymentRoutes = require("./routes/ownerPaymentRoutes");

// Mount the main routers
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/alerts", alertRoutes);

// Mount the main owner router at the top-level /api/owner path
app.use("/api/owner", ownerRoutes);
// Then, mount the sub-routers under their correct prefixes
app.use("/api/owner/hostels", hostelRoutes);
app.use("/api/owner/rooms", roomRoutes);
app.use("/api/owner/rules", ruleRoutes);
app.use("/api/owner/booking-requests", bookingRoutes);
app.use("/api/owner", ownerPaymentRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
