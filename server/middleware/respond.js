/**
 * respond.js — Express middleware that attaches response helper methods to `res`.
 *
 * Usage:
 *   app.use(respond);  // add once in app.js before routes
 *
 * Then in any controller:
 *   res.ok({ hostel })                          // 200 { success: true, hostel: {...} }
 *   res.ok({ students }, { total: 42 })         // 200 { success: true, students: [...], total: 42 }
 *   res.created({ booking })                    // 201 { success: true, booking: {...} }
 *   res.fail("Hostel not found", 404)           // 404 { success: false, error: "..." }
 *   res.validationFail([{ field, message }])    // 400 { success: false, error: "Validation failed", details: [...] }
 */
const respond = (_req, res, next) => {
  /**
   * 200 OK with a data payload.
   * @param {object} data  - Top-level fields to merge into response body
   * @param {object} [meta] - Optional extra fields (pagination, totals, etc.)
   */
  res.ok = (data = {}, meta = {}) => {
    return res.status(200).json({ success: true, ...data, ...meta });
  };

  /**
   * 201 Created.
   * @param {object} data - Top-level fields to merge into response body
   */
  res.created = (data = {}) => {
    return res.status(201).json({ success: true, ...data });
  };

  /**
   * Error response.
   * @param {string} message  - Human-readable reason
   * @param {number} [code=400] - HTTP status code
   */
  res.fail = (message, code = 400) => {
    return res.status(code).json({ success: false, error: message });
  };

  /**
   * 400 Validation failure with field-level details.
   * @param {Array<{field: string, message: string}>} details
   */
  res.validationFail = (details) => {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details,
    });
  };

  next();
};

module.exports = respond;
