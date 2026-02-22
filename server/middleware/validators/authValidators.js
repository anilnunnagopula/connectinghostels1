const { body, validationResult } = require("express-validator");

/**
 * Runs accumulated validation rules and short-circuits with 400 if any fail.
 * Place this as the last item in a route's middleware array, before the controller.
 */
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

// ==================== REGISTER ====================
const registerRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 80 }).withMessage("Name must be 2–80 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .normalizeEmail(),

  body("phone")
    .optional({ checkFalsy: true })
    .isMobilePhone().withMessage("Invalid phone number"),

  body("phoneNumber")
    .optional({ checkFalsy: true })
    .isMobilePhone().withMessage("Invalid phone number"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Za-z]/).withMessage("Password must contain at least one letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number"),

  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["student", "owner"]).withMessage("Role must be student or owner"),

  body("hostelName")
    .if(body("role").equals("owner"))
    .notEmpty().withMessage("Hostel name is required for owners")
    .isLength({ max: 100 }).withMessage("Hostel name must be under 100 characters"),
];

// ==================== LOGIN ====================
const loginRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

// ==================== FORGOT PASSWORD ====================
const forgotPasswordRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .normalizeEmail(),
];

// ==================== RESET PASSWORD ====================
const resetPasswordRules = [
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Za-z]/).withMessage("Password must contain at least one letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number"),

  body("confirmPassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

// ==================== COMPLETE PROFILE ====================
const completeProfileRules = [
  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["student", "owner"]).withMessage("Role must be student or owner"),

  body("phone")
    .notEmpty().withMessage("Phone number is required")
    .isMobilePhone().withMessage("Invalid phone number"),

  body("hostelName")
    .if(body("role").equals("owner"))
    .notEmpty().withMessage("Hostel name is required for owners"),
];

// ==================== UPDATE PROFILE ====================
const updateProfileRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 }).withMessage("Name must be 2–80 characters"),

  body("phone")
    .optional({ checkFalsy: true })
    .isMobilePhone().withMessage("Invalid phone number"),

  body("phoneNumber")
    .optional({ checkFalsy: true })
    .isMobilePhone().withMessage("Invalid phone number"),

  body("newPassword")
    .optional({ checkFalsy: true })
    .isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
    .matches(/[A-Za-z]/).withMessage("Password must contain at least one letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number"),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  completeProfileRules,
  updateProfileRules,
};
