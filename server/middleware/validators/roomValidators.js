const { body, param, query } = require("express-validator");

const ROOM_STATUSES = ["available", "occupied", "maintenance", "reserved"];

// ==================== ROOM CREATE ====================
const createRoomRules = [
  body("hostelId")
    .notEmpty().withMessage("Hostel ID is required")
    .isMongoId().withMessage("Invalid hostel ID"),

  body("floor")
    .notEmpty().withMessage("Floor is required")
    .isInt({ min: 0, max: 50 }).withMessage("Floor must be between 0 and 50"),

  body("roomNumber")
    .trim()
    .notEmpty().withMessage("Room number is required")
    .isLength({ max: 20 }).withMessage("Room number must be under 20 characters"),

  body("capacity")
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage("Capacity must be between 1 and 10"),

  body("pricePerMonth")
    .optional()
    .isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),

  body("type")
    .optional()
    .isIn(["single", "double", "triple", "dormitory"])
    .withMessage("Room type must be single, double, triple, or dormitory"),
];

// ==================== ROOM UPDATE ====================
const updateRoomRules = [
  body("floor")
    .optional()
    .isInt({ min: 0, max: 50 }).withMessage("Floor must be between 0 and 50"),

  body("capacity")
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage("Capacity must be between 1 and 10"),

  body("pricePerMonth")
    .optional()
    .isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),

  body("type")
    .optional()
    .isIn(["single", "double", "triple", "dormitory"])
    .withMessage("Invalid room type"),
];

// ==================== STATUS UPDATE ====================
const updateStatusRules = [
  param("id")
    .isMongoId().withMessage("Invalid room ID"),

  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(ROOM_STATUSES).withMessage(`Status must be one of: ${ROOM_STATUSES.join(", ")}`),
];

// ==================== ROOM ID PARAM ====================
const roomIdRules = [
  param("id")
    .isMongoId().withMessage("Invalid room ID"),
];

// ==================== LIST QUERY ====================
const listRoomsRules = [
  query("hostelId")
    .notEmpty().withMessage("hostelId query param is required")
    .isMongoId().withMessage("Invalid hostel ID"),

  query("floor")
    .optional()
    .isInt({ min: 0 }).withMessage("Floor must be a non-negative integer"),

  query("status")
    .optional()
    .isIn(ROOM_STATUSES).withMessage(`Status filter must be one of: ${ROOM_STATUSES.join(", ")}`),
];

module.exports = { createRoomRules, updateRoomRules, updateStatusRules, roomIdRules, listRoomsRules };
