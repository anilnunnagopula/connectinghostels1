const { body, param } = require("express-validator");

// ==================== HOSTEL CREATE ====================
const createHostelRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Hostel name is required")
    .isLength({ min: 2, max: 120 }).withMessage("Name must be 2–120 characters"),

  body("locality")
    .trim()
    .notEmpty().withMessage("Locality is required"),

  body("type")
    .notEmpty().withMessage("Type is required")
    .isIn(["Boys", "Girls", "Co-ed"]).withMessage("Type must be Boys, Girls, or Co-ed"),

  body("floors")
    .notEmpty().withMessage("Number of floors is required")
    .isInt({ min: 1, max: 50 }).withMessage("Floors must be between 1 and 50"),

  body("totalRooms")
    .notEmpty().withMessage("Total rooms is required")
    .isInt({ min: 1 }).withMessage("Total rooms must be at least 1"),

  body("pricePerMonth")
    .notEmpty().withMessage("Price per month is required")
    .isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),

  body("contactNumber")
    .trim()
    .notEmpty().withMessage("Contact number is required")
    .isMobilePhone().withMessage("Invalid contact number"),

  body("address")
    .trim()
    .notEmpty().withMessage("Address is required"),
];

// ==================== HOSTEL UPDATE ====================
const updateHostelRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 }).withMessage("Name must be 2–120 characters"),

  body("type")
    .optional()
    .isIn(["Boys", "Girls", "Co-ed"]).withMessage("Type must be Boys, Girls, or Co-ed"),

  body("floors")
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage("Floors must be between 1 and 50"),

  body("totalRooms")
    .optional()
    .isInt({ min: 1 }).withMessage("Total rooms must be at least 1"),

  body("pricePerMonth")
    .optional()
    .isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),

  body("contactNumber")
    .optional({ checkFalsy: true })
    .isMobilePhone().withMessage("Invalid contact number"),
];

// ==================== HOSTEL ID PARAM ====================
const hostelIdRules = [
  param("id")
    .isMongoId().withMessage("Invalid hostel ID"),
];

module.exports = { createHostelRules, updateHostelRules, hostelIdRules };
