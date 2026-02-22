/**
 * emailQueue.js — BullMQ async email queue
 *
 * Moves email sends off the request/response cycle so that:
 * - Password reset endpoints return instantly (no waiting for SMTP)
 * - Failed emails are retried automatically with exponential backoff
 * - The Node.js event loop is never blocked by SMTP I/O
 *
 * Falls back gracefully to synchronous sending when REDIS_URL is not set.
 *
 * Usage:
 *   const { addEmailJob } = require("../queues/emailQueue");
 *
 *   // Queue an email job (non-blocking)
 *   if (addEmailJob) {
 *     await addEmailJob("password-reset", { user, token });
 *   } else {
 *     await sendPasswordResetEmail(user, token);  // synchronous fallback
 *   }
 */

const logger = require("../middleware/logger");

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  // Redis not configured — export no-ops so callers can branch safely
  module.exports = { addEmailJob: null, startEmailWorker: () => {} };
  return;
}

const { Queue, Worker } = require("bullmq");
const { sendPasswordResetEmail } = require("../services/emailService");

// Parse Redis URL into ioredis connection options (BullMQ format)
let connection;
try {
  const url = new URL(REDIS_URL);
  connection = {
    host: url.hostname,
    port: parseInt(url.port, 10) || 6379,
    ...(url.password ? { password: decodeURIComponent(url.password) } : {}),
    ...(url.protocol === "rediss:" ? { tls: {} } : {}),
  };
} catch {
  // Malformed REDIS_URL — export no-ops
  module.exports = { addEmailJob: null, startEmailWorker: () => {} };
  return;
}

const emailQueue = new Queue("email", { connection });

/**
 * Add an email job to the queue.
 * Jobs are retried up to 3 times with exponential backoff.
 *
 * @param {string} name - Job type: "password-reset"
 * @param {object} data - Job payload
 */
const addEmailJob = async (name, data) => {
  await emailQueue.add(name, data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  });
};

/**
 * Start the email worker. Call this once on server start.
 * Returns the worker instance (keep alive for the server lifetime).
 */
const startEmailWorker = () => {
  const worker = new Worker(
    "email",
    async (job) => {
      if (job.name === "password-reset") {
        await sendPasswordResetEmail(job.data.user, job.data.token);
        logger.info(`Password reset email sent to ${job.data.user.email}`);
      }
    },
    { connection, concurrency: 2 },
  );

  worker.on("failed", (job, err) => {
    logger.error(
      `Email job ${job?.id} (${job?.name}) failed after ${job?.attemptsMade} attempts: ${err.message}`,
    );
  });

  return worker;
};

module.exports = { addEmailJob, startEmailWorker };
