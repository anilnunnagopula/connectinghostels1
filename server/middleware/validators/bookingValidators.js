const { body, param, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ==================== CREATE BOOKING REQUEST ====================
const createBookingRules = [
  body("hostelId")
    .notEmpty().withMessage("Hostel ID is required")
    .isMongoId().withMessage("Invalid hostel ID"),

  body("floor")
    .optional()
    .isInt({ min: 0, max: 50 }).withMessage("Floor must be a number between 0 and 50"),

  body("roomNumber")
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage("Room number must be under 20 characters"),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Message must be under 500 characters"),
];

// ==================== APPROVE / REJECT (param validation) ====================
const requestIdRules = [
  param("requestId")
    .isMongoId().withMessage("Invalid request ID"),
];

const rejectRules = [
  ...requestIdRules,
  body("reason")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Rejection reason must be under 300 characters"),
];

// ==================== COMPLAINT ====================
const createComplaintRules = [
  body("title")
    .trim()
    .notEmpty().withMessage("Complaint title is required")
    .isLength({ max: 150 }).withMessage("Title must be under 150 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10, max: 2000 }).withMessage("Description must be 10–2000 characters"),

  body("category")
    .optional()
    .isIn(["maintenance", "noise", "cleanliness", "safety", "billing", "other"])
    .withMessage("Invalid complaint category"),
];

// ==================== PAYMENT ====================
const createPaymentOrderRules = [
  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isFloat({ min: 1 }).withMessage("Amount must be a positive number"),

  body("currency")
    .optional()
    .isIn(["INR"]).withMessage("Only INR currency is supported"),
];

module.exports = {
  validate,
  createBookingRules,
  requestIdRules,
  rejectRules,
  createComplaintRules,
  createPaymentOrderRules,
};
