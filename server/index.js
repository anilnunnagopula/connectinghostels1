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
console.log("📦 Loading Phase 1 routes...");
try {
  const authRoutes = require("./routes/authRoutes");
  const publicHostelRoutes = require("./routes/hostelRoutes");
  const contactRoutes = require("./routes/contact");
  const otpRoutes = require("./routes/otpRoutes");

  app.use("/api/auth", authRoutes);
  app.use("/api/hostels", publicHostelRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/otp", otpRoutes);
  console.log("✅ Phase 1 routes loaded");
} catch (error) {
  console.error("❌ Error loading Phase 1 routes:", error.message);
  console.error(error.stack);
}

// ==================== PHASE 2A (OWNER – ACTIVE) ====================
console.log("🏢 Loading Phase 2A routes...");
try {
  const ownerRoutes = require("./routes/ownerRoutes");
  const ownerHostelRoutes = require("./routes/ownerHostelRoutes");
  const roomRoutes = require("./routes/roomRoutes");
  const ruleRoutes = require("./routes/ruleRoutes");
  const ownerPaymentRoutes = require("./routes/ownerPaymentRoutes");

  app.use("/api/owner/hostels", ownerHostelRoutes);
  app.use("/api/owner/rooms", roomRoutes);
  app.use("/api/rules", ruleRoutes);
  app.use("/api/owner/payments", ownerPaymentRoutes);
  app.use("/api/owner", ownerRoutes);
  console.log("✅ Phase 2A routes loaded");
} catch (error) {
  console.error("❌ Error loading Phase 2A routes:", error.message);
  console.error(error.stack);
}

// ==================== PHASE 2B (STUDENT – ACTIVE) ====================
console.log("👨‍🎓 Loading Phase 2B routes...");
try {
  const studentRoutes = require("./routes/studentRoutes");
  const { studentRouter, ownerRouter } = require("./routes/bookingRoutes");
  const complaintRoutes = require("./routes/complaintRoutes");

  // ✅ CRITICAL FIX: Mount general routes FIRST, then booking routes
  // This prevents studentRoutes from overriding booking endpoints

  // Student general routes (search, dashboard, interested, etc.)
  app.use("/api/students", studentRoutes);
  console.log("✅ Student general routes mounted at /api/students");

  // Student booking routes (must come AFTER general routes)
  app.use("/api/students", studentRouter);
  console.log("✅ Student booking routes mounted:");
  console.log("   - POST /api/students/booking-request");
  console.log("   - GET /api/students/my-requests");
  console.log("   - DELETE /api/students/booking-request/:id");

  // Owner booking routes
  app.use("/api/owner/booking-requests", ownerRouter);
  console.log("✅ Owner booking routes mounted:");
  console.log("   - GET /api/owner/booking-requests/mine");
  console.log("   - POST /api/owner/booking-requests/:id/approve");
  console.log("   - POST /api/owner/booking-requests/:id/reject");

  // Complaint routes
  app.use("/api/complaints", complaintRoutes);
  console.log("✅ Complaint routes mounted");

  console.log("✅ Phase 2B routes loaded");
} catch (error) {
  console.error("❌ Error loading Phase 2B routes:", error.message);
  console.error(error.stack);
}

// ==================== NOTIFICATIONS ====================
console.log("🔔 Loading notification routes...");
try {
  const notificationRoutes = require("./routes/notificationRoutes");
  const alertRoutes = require("./routes/alertRoutes");

  app.use("/api", notificationRoutes); // Student notification routes
  app.use("/api/alerts", alertRoutes); // Owner alert routes
  console.log("✅ Notification routes loaded");
} catch (error) {
  console.error("❌ Error loading notification routes:", error.message);
  console.error(error.stack);
}

// ==================== HEALTH CHECK ====================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ==================== SIMPLE DEBUG ENDPOINT ====================
app.get("/api/test/booking-routes", (req, res) => {
  res.json({
    message: "If you see this, the route works!",
    expectedEndpoints: {
      student: [
        "POST /api/students/booking-request",
        "GET /api/students/my-requests",
        "DELETE /api/students/booking-request/:id",
      ],
      owner: [
        "GET /api/owner/booking-requests/mine",
        "POST /api/owner/booking-requests/:id/approve",
        "POST /api/owner/booking-requests/:id/reject",
      ],
    },
    testInstructions: {
      student:
        "Try: curl -H 'Authorization: Bearer YOUR_TOKEN' http://localhost:5000/api/students/my-requests",
      owner:
        "Try: curl -H 'Authorization: Bearer YOUR_TOKEN' http://localhost:5000/api/owner/booking-requests/mine",
    },
  });
});

// ==================== BETTER DEBUG ROUTES ====================
function getRoutes(app) {
  const routes = [];

  function extractRoutes(stack, prefix = "") {
    stack.forEach((middleware) => {
      if (middleware.route) {
        // Direct route
        const methods = Object.keys(middleware.route.methods)
          .join(",")
          .toUpperCase();
        routes.push({
          method: methods,
          path: prefix + middleware.route.path,
        });
      } else if (middleware.name === "router" && middleware.handle.stack) {
        // Nested router
        const routerPath = middleware.regexp.source
          .replace("\\/?(?=\\/|$)", "")
          .replace(/\\\//g, "/")
          .replace(/\^/g, "")
          .replace(/\$/g, "")
          .replace(/\(\?:\(\[\^\\\/\]\+\?\)\)/g, ":param");

        extractRoutes(middleware.handle.stack, prefix + routerPath);
      }
    });
  }

  if (app._router && app._router.stack) {
    extractRoutes(app._router.stack);
  }

  return routes;
}

app.get("/api/debug/routes", (req, res) => {
  try {
    const allRoutes = getRoutes(app);

    res.json({
      total: allRoutes.length,
      routes: allRoutes,
      bookingRoutes: allRoutes.filter(
        (r) => r.path.includes("booking") || r.path.includes("request"),
      ),
      studentRoutes: allRoutes.filter((r) => r.path.includes("/students")),
      ownerRoutes: allRoutes.filter((r) => r.path.includes("/owner")),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
});

console.log("\n🔍 Debug endpoints:");
console.log("   - Health: http://localhost:5000/api/health");
console.log("   - Routes: http://localhost:5/api/debug/routes");
console.log("   - Test: http://localhost:5000/api/test/booking-routes\n");

// ==================== DATABASE & SERVER ====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📦 Phase 1 Active - Public + Auth`);
  console.log(`🏢 Phase 2A Active - Owner APIs`);
  console.log(`✅ Phase 2B Active - Student APIs (including booking)`);
  console.log(
    `\n💡 Quick test: http://localhost:${PORT}/api/test/booking-routes\n`,
  );
});
