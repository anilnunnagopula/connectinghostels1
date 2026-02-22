/**
 * cache.js — Redis cache middleware
 *
 * Caches JSON GET responses in Redis for a configurable TTL.
 * Completely transparent no-op when REDIS_URL is not set.
 *
 * Usage:
 *   const { cacheMiddleware, invalidateCache } = require("./cache");
 *   router.get("/", cacheMiddleware(300), controller.list);       // 5-min cache
 *   await invalidateCache("/api/hostels*");                        // bust on write
 */

const logger = require("./logger");

let redis = null;

if (process.env.REDIS_URL) {
  try {
    const Redis = require("ioredis");
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      enableReadyCheck: false,
      connectTimeout: 3000,
    });
    redis.on("error", (err) => {
      logger.warn("Redis unavailable (cache disabled): " + err.message);
      redis = null;
    });
  } catch {
    redis = null;
  }
}

const DEFAULT_TTL = 60; // seconds

/**
 * Express cache middleware.
 * Caches successful (HTTP 200) JSON responses in Redis for `ttl` seconds.
 * Skips cache when Redis is not configured or unavailable.
 *
 * @param {number} ttl - Cache duration in seconds (default: 60)
 */
const cacheMiddleware = (ttl = DEFAULT_TTL) => async (req, res, next) => {
  if (!redis) return next();

  const key = `cache:${req.originalUrl}`;

  try {
    const cached = await redis.get(key);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.json(JSON.parse(cached));
    }
  } catch {
    // Cache read error — proceed to handler
    return next();
  }

  // Intercept res.json to store the response before sending
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    if (res.statusCode === 200 && redis) {
      redis.setex(key, ttl, JSON.stringify(data)).catch(() => {});
    }
    res.setHeader("X-Cache", "MISS");
    return originalJson(data);
  };

  next();
};

/**
 * Invalidate all cache entries whose key matches the given glob pattern.
 * Call this after any mutation that would stale the cached data.
 *
 * @param {string} pattern - Glob pattern relative to the cache namespace
 *                           e.g. "/api/hostels*" → invalidates all hostel list caches
 */
const invalidateCache = async (pattern) => {
  if (!redis) return;
  try {
    const keys = await redis.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.debug(`Cache invalidated: ${keys.length} key(s) matching ${pattern}`);
    }
  } catch {
    // best-effort — don't throw
  }
};

module.exports = { cacheMiddleware, invalidateCache };
