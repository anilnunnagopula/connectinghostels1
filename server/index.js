// dotenv must load first so SENTRY_DSN is available for Sentry.init()
require("dotenv").config();

// Sentry must be initialized before any other require() calls
const Sentry = require("@sentry/node");

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  });
}

require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("mongoose-sanitize");
const crypto = require("crypto");
const path = require("path");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ==================== SECURITY MIDDLEWARE ====================
app.use(
  helmet({
    // Allow images served from /uploads to be loaded cross-origin
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(compression());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://connectinghostels1.netlify.app",
    ],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());

// Attach a unique request ID to every request for log tracing
app.use((req, _res, next) => {
  req.id = crypto.randomUUID();
  next();
});

// ==================== FILE SERVING ====================
// Hostel images are public. Complaint attachments require authentication.
app.use("/uploads", (req, res, next) => {
  if (req.path.startsWith("/complaints")) {
    const { requireAuth } = require("./middleware/authMiddleware");
    return requireAuth(req, res, next);
  }
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================== ROUTES ====================
const authRoutes = require("./routes/authRoutes");
const publicHostelRoutes = require("./routes/hostelRoutes");
const contactRoutes = require("./routes/contact");
const otpRoutes = require("./routes/otpRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const ownerHostelRoutes = require("./routes/ownerHostelRoutes");
const roomRoutes = require("./routes/roomRoutes");
const ruleRoutes = require("./routes/ruleRoutes");
const studentRoutes = require("./routes/studentRoutes");
const { studentRouter, ownerRouter } = require("./routes/bookingRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const alertRoutes = require("./routes/alertRoutes");
const ownerPaymentRoutes = require("./routes/ownerPaymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Public + Auth
app.use("/api/auth", authRoutes);
app.use("/api/hostels", publicHostelRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/otp", otpRoutes);

// Owner
app.use("/api/owner", ownerRoutes);
app.use("/api/owner/hostels", ownerHostelRoutes);
app.use("/api/owner/rooms", roomRoutes);
app.use("/api/rules", ruleRoutes);

// Student
app.use("/api/students", studentRoutes);
app.use("/api/students", studentRouter);
app.use("/api/owner/booking-requests", ownerRouter);
app.use("/api/complaints", complaintRoutes);

// Payments + Notifications
app.use("/api/payments", paymentRoutes);
app.use("/api/owner/payment-history", ownerPaymentRoutes);
app.use("/api", notificationRoutes);
app.use("/api/alerts", alertRoutes);

// Admin
app.use("/api/admin", adminRoutes);

// ==================== HEALTH CHECK ====================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ==================== 404 + GLOBAL ERROR HANDLER ====================
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Sentry error handler must come before our custom error handler
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

app.use(errorHandler);

// ==================== DATABASE ====================
mongoose
  .connect(process.env.MONGO_URI, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => {
    logger.error("MongoDB connection error: " + err.message);
    process.exit(1);
  });

// ==================== SERVER ====================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);

  // Start async email worker (no-op if REDIS_URL is not configured)
  const { startEmailWorker } = require("./queues/emailQueue");
  startEmailWorker();
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received — shutting down gracefully");
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info("MongoDB connection closed");
      process.exit(0);
    });
  });
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection: " + reason);
});
