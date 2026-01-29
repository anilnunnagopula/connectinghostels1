const rateLimit = require("express-rate-limit");

// Rate limiter for password reset
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Max 3 requests per windowMs per IP
  message: {
    error: "Too many password reset attempts",
    message: "Please try again in 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count all requests
  skipFailedRequests: false,
  keyGenerator: (req) => {
    // Rate limit by email instead of IP
    return req.body.email || req.ip;
  },
});

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 failed login attempts
  message: {
    error: "Too many login attempts",
    message: "Please try again in 15 minutes",
  },
  skipSuccessfulRequests: true, // Don't count successful logins
  keyGenerator: (req) => req.body.email || req.ip,
});

module.exports = {
  passwordResetLimiter,
  loginLimiter,
};
