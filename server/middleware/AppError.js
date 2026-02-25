/**
 * AppError — Operational (expected) error with an HTTP status code.
 *
 * Usage in controllers:
 *   throw new AppError(404, "Hostel not found");
 *   throw new AppError(409, "Student already has an active booking");
 *
 * The global errorHandler in middleware/errorHandler.js reads err.statusCode
 * and err.message, so these surface correctly without any changes there.
 */
class AppError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (4xx or 5xx)
   * @param {string} message    - Human-readable error message (sent to client)
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes from unexpected programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
