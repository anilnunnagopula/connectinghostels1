// dotenv must load first so SENTRY_DSN is available for Sentry.init()
require("dotenv").config();

const app = require("./app");
const http = require("http");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const logger = require("./middleware/logger");

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://connectinghostels1.netlify.app",
];

const httpServer = http.createServer(app);

// ==================== SOCKET.IO ====================
const io = new Server(httpServer, {
  cors: { origin: ALLOWED_ORIGINS, credentials: true },
});

// Redis adapter for horizontal scaling (no-op if REDIS_URL not configured)
if (process.env.REDIS_URL) {
  try {
    const { default: Redis } = require("ioredis");
    const pubClient = new Redis(process.env.REDIS_URL);
    const subClient = pubClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
    logger.info("Socket.io Redis adapter enabled");
  } catch (err) {
    logger.warn("Socket.io Redis adapter failed — running single-node: " + err.message);
  }
}

// Authenticate socket connections with JWT
io.use((socket, next) => {
  // 1. Try explicit auth token (legacy / non-browser clients)
  let token =
    socket.handshake.auth?.token ||
    socket.handshake.query?.token;

  // 2. Fall back to httpOnly cookie sent automatically by the browser
  if (!token) {
    const cookieHeader = socket.handshake.headers.cookie || "";
    const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }

  if (!token) return next(new Error("Authentication required"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = String(decoded.id);
    socket.userRole = decoded.role || null;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", async (socket) => {
  socket.join(`user:${socket.userId}`);

  if (socket.userRole === "owner") {
    socket.join(`owner:${socket.userId}`);
  }
  if (socket.userRole === "admin") {
    socket.join("admin");
  }
  // Students admitted to a hostel join its room for hostel-scoped broadcasts
  if (socket.userRole === "student") {
    try {
      const Student = require("./models/Student");
      const student = await Student.findOne({ user: socket.userId }).select("currentHostel");
      if (student?.currentHostel) {
        socket.join(`hostel:${student.currentHostel}`);
        socket.hostelId = String(student.currentHostel);
      }
    } catch {
      // non-critical — socket still works without hostel room
    }
  }

  logger.debug(`Socket connected: userId=${socket.userId} role=${socket.userRole}`);
  socket.on("disconnect", () => {
    logger.debug(`Socket disconnected: userId=${socket.userId}`);
  });
});

// Make io available in controllers via req.app.locals.io
app.locals.io = io;

// ==================== DATABASE ====================
mongoose
  .connect(process.env.MONGO_URI, {
    maxPoolSize: 50,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => {
    logger.error("MongoDB connection error: " + err.message);
    process.exit(1);
  });

// ==================== SERVER ====================
const PORT = process.env.PORT || 5000;
const server = httpServer.listen(PORT, () => {
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
