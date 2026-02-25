/**
 * emailQueue.js — BullMQ async email queue
 *
 * Falls back gracefully to no-ops when REDIS_URL is not configured.
 *
 * Usage:
 *   const { addEmailJob } = require("../queues/emailQueue");
 *   if (addEmailJob) {
 *     await addEmailJob("password-reset", { user, token });
 *   }
 */

const logger = require("../middleware/logger");

const REDIS_URL = process.env.REDIS_URL;

// Attempt to parse a Redis connection config from REDIS_URL
let connection = null;

if (REDIS_URL) {
  try {
    const url = new URL(REDIS_URL);
    connection = {
      host: url.hostname,
      port: parseInt(url.port, 10) || 6379,
      ...(url.password ? { password: decodeURIComponent(url.password) } : {}),
      ...(url.protocol === "rediss:" ? { tls: {} } : {}),
    };
  } catch {
    logger.warn("Malformed REDIS_URL — email queue disabled");
  }
}

if (!connection) {
  // Redis not configured or URL malformed — export no-ops so callers branch safely
  module.exports = { addEmailJob: null, startEmailWorker: () => {} };
} else {
  const { Queue, Worker } = require("bullmq");
  const {
    sendPasswordResetEmail,
    sendWelcomeEmail,
    sendBookingApprovedEmail,
    sendBookingRejectedEmail,
    sendHostelApprovedEmail,
    sendHostelRejectedEmail,
    sendDueReminderEmail,
  } = require("../services/emailService");

  const emailQueue = new Queue("email", { connection });

  /**
   * Add an email job to the queue.
   * Jobs are retried up to 3 times with exponential backoff.
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
   */
  const startEmailWorker = () => {
    const worker = new Worker(
      "email",
      async (job) => {
        switch (job.name) {
          case "password-reset":
            await sendPasswordResetEmail(job.data.user, job.data.token);
            logger.info(`Password reset email sent to ${job.data.user.email}`);
            break;
          case "welcome":
            await sendWelcomeEmail(job.data.user);
            logger.info(`Welcome email sent to ${job.data.user.email}`);
            break;
          case "booking-approved":
            await sendBookingApprovedEmail(job.data);
            logger.info(`Booking-approved email sent to ${job.data.studentEmail}`);
            break;
          case "booking-rejected":
            await sendBookingRejectedEmail(job.data);
            logger.info(`Booking-rejected email sent to ${job.data.studentEmail}`);
            break;
          case "hostel-approved":
            await sendHostelApprovedEmail(job.data);
            logger.info(`Hostel-approved email sent to ${job.data.ownerEmail}`);
            break;
          case "hostel-rejected":
            await sendHostelRejectedEmail(job.data);
            logger.info(`Hostel-rejected email sent to ${job.data.ownerEmail}`);
            break;
          case "due-reminder":
            await sendDueReminderEmail(job.data);
            logger.info(`Due-reminder email sent to ${job.data.studentEmail}`);
            break;
          default:
            logger.warn(`Unknown email job type: ${job.name}`);
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
}
