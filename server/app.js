// app.js — Express application factory (no listen, no MongoDB connect)
// Imported by index.js (production) and __tests__ (testing via Supertest)

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
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const crypto = require("crypto");
const path = require("path");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const respond = require("./middleware/respond");
const rateLimit = require("express-rate-limit");
const { generateToken, csrfProtection } = require("./middleware/csrf");

// ==================== STARTUP CHECKS ====================
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  // eslint-disable-next-line no-console
  console.error("FATAL: JWT_SECRET is missing or too weak (must be >= 32 chars). Server will not start.");
  process.exit(1);
}

const app = express();

// ==================== SECURITY MIDDLEWARE ====================
app.use(
  helmet({
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

// Request timeout — abort requests that take longer than 30 seconds
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    res.status(408).json({ error: "Request timeout" });
  });
  next();
});

// Raw body saved to req.rawBody for Razorpay webhook signature verification
app.use(
  express.json({
    limit: "10kb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());

// Standard response helpers (res.ok, res.created, res.fail, res.validationFail)
app.use(respond);

// Attach a unique request ID to every request for log tracing
app.use((req, _res, next) => {
  req.id = crypto.randomUUID();
  next();
});

// ==================== GLOBAL RATE LIMITER ====================
// Applied to all /api/* routes — prevents DDoS and API abuse
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                  // 200 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please slow down and try again later." },
  skip: (req) => req.path === "/health" || req.path === "/api/health", // don't limit health checks
});
app.use("/api/", globalLimiter);


// ==================== HEALTH CHECK ====================
app.get("/health", (req, res) => {
  const mongoose = require("mongoose");
  const dbState = mongoose.connection.readyState; // 1 = connected
  const status = dbState === 1 ? "ok" : "degraded";
  res.status(dbState === 1 ? 200 : 503).json({
    status,
    db: dbState === 1 ? "connected" : "disconnected",
    uptime: Math.floor(process.uptime()),
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Keep legacy path for backwards compat
app.get("/api/health", (req, res) => {
  const mongoose = require("mongoose");
  const dbState = mongoose.connection.readyState;
  const status = dbState === 1 ? "ok" : "degraded";
  res.status(dbState === 1 ? 200 : 503).json({
    status,
    db: dbState === 1 ? "connected" : "disconnected",
    uptime: Math.floor(process.uptime()),
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
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
const billingRoutes = require("./routes/billingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// ==================== CSRF PROTECTION ====================
// Applies the double-submit cookie pattern to all state-mutating requests.
// The GET /api/csrf endpoint lets the frontend obtain a fresh token on app load.
app.get("/api/csrf", (req, res) => {
  const token = generateToken(req, res);
  res.json({ csrfToken: token });
});
app.use(csrfProtection);

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
// NOTE: studentRoutes already includes all booking-request sub-routes.
// studentRouter (from bookingRoutes.js) was a duplicate — removed to prevent
// double-registration of POST /api/students/booking-request.
app.use("/api/students", studentRoutes);
app.use("/api/owner/booking-requests", ownerRouter);
app.use("/api/complaints", complaintRoutes);

// Payments + Notifications
app.use("/api/payments", paymentRoutes);
app.use("/api/owner/payment-history", ownerPaymentRoutes);
app.use("/api", notificationRoutes);
app.use("/api/alerts", alertRoutes);

// Admin
app.use("/api/admin", adminRoutes);

// Billing + Reviews
app.use("/api/billing", billingRoutes);
app.use("/api/reviews", reviewRoutes);

// ==================== 404 + GLOBAL ERROR HANDLER ====================
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

app.use(errorHandler);

module.exports = app;
