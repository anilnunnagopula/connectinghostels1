// /server/index.js
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

app.use("/api/auth", authRoutes);
app.use("/api/owner", hostelRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/contact", contactRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
