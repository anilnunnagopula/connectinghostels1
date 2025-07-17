const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "https://connectinghostels1.netlify.app"],
    credentials: true,
  })
);

app.use(express.json());

// 📦 Import Routes AFTER middlewares
const authRoutes = require("./routes/authRoutes");
const hostelRoutes = require("./routes/hostelRoutes"); // This file should contain the /add-hostel route
const studentRoutes = require("./routes/studentRoutes");
const contactRoutes = require("./routes/contact");

// 🛣️ Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/owner", hostelRoutes); // CHANGED THIS LINE: Mounting hostelRoutes under /api/owner
app.use("/api/students", studentRoutes);
app.use("/api/contact", contactRoutes); 
// 🌍 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hostels", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🚀 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
