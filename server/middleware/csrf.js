/**
 * csrf.js — Double-submit cookie CSRF protection using csrf-csrf
 *
 * Strategy: Double-submit cookie pattern
 *   1. GET /api/csrf → sets a non-httpOnly "csrf_token" cookie that JS can read
 *   2. Client reads the cookie and attaches it as x-csrf-token header
 *   3. This middleware validates header === cookie on all state-mutating requests
 *
 * Why not SameSite=Strict? The frontend (Netlify) and API are on different origins.
 * SameSite=Strict would block the auth cookie from being sent at all.
 * The double-submit pattern works correctly in cross-origin setups.
 *
 * Excluded from CSRF checks:
 *   - GET, HEAD, OPTIONS (safe methods)
 *   - POST /api/auth/google (uses an OAuth credential, not a session cookie)
 *   - POST /api/payments/webhook (must be called by Razorpay, verified by signature)
 *   - POST /api/otp/* (unauthenticated — cookie not yet set)
 */

const { doubleCsrf } = require("csrf-csrf");

const isProduction = process.env.NODE_ENV === "production";

const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.JWT_SECRET, // reuse JWT_SECRET — already validated ≥32 chars at startup
  cookieName: "csrf_token",
  cookieOptions: {
    httpOnly: false,   // Must be readable by JS for double-submit pattern
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
    path: "/",
  },
  size: 64,
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

/**
 * Routes excluded from CSRF verification.
 * These are either unauthenticated, handled by signature verification, or use OAuth.
 */
const CSRF_EXCLUDED = [
  { method: "POST", path: "/api/auth/google" },
  { method: "POST", path: "/api/payments/webhook" },
  { method: "POST", path: "/api/otp/send" },
  { method: "POST", path: "/api/otp/verify" },
  { method: "POST", path: "/api/auth/forgot-password" },
  { method: "POST", path: "/api/auth/reset-password" },
];

/**
 * Selective CSRF protection middleware.
 * Skips safe HTTP methods and explicitly excluded paths.
 */
const csrfProtection = (req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) return next();

  const excluded = CSRF_EXCLUDED.some(
    (e) => e.method === req.method && req.path.startsWith(e.path.replace("/api", ""))
  );
  if (excluded) return next();

  return doubleCsrfProtection(req, res, next);
};

module.exports = { generateToken, csrfProtection };
