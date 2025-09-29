const { body, param, query, validationResult } = require("express-validator");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  handleValidationErrors,
];

const validateUserLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const validateUserUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("profile.company")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),
  body("profile.contact")
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  body("profile.signature")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Signature cannot exceed 500 characters"),
  handleValidationErrors,
];

// Template validation rules
const validateTemplate = [
  (req, res, next) => {
    // Ensure fields exist even if they come from multipart/form-data
    const { title, body, category, visibility } = req.body;

    const errors = [];

    // Title
    if (!title || title.trim().length < 3 || title.trim().length > 100) {
      errors.push({
        msg: "Title must be between 3 and 100 characters",
        param: "title",
      });
    }

    // Body
    if (!body || body.trim().length < 10 || body.trim().length > 100000) {
      errors.push({
        msg: "Body must be between 10 and 100000 characters",
        param: "body",
      });
    }

    // Category
    const validCategories = ["Career", "Business", "Professional", "Personal"];
    if (!validCategories.includes(category)) {
      errors.push({
        msg: "Invalid category",
        param: "category",
      });
    }

    // Visibility
    const validVisibilities = ["global", "private"];
    if (visibility && !validVisibilities.includes(visibility)) {
      errors.push({
        msg: "Visibility must be either global or private",
        param: "visibility",
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  },
];

// Email validation rules
const validateEmail = [
  body("recipients")
    .isArray({ min: 1 })
    .withMessage("At least one recipient is required"),
  body("recipients.*")
    .isEmail()
    .withMessage("All recipients must be valid email addresses"),
  body("subject")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Subject must be between 1 and 200 characters"),
  body("body")
    .trim()
    .isLength({ min: 1, max: 50000 })
    .withMessage("Body must be between 1 and 50000 characters"),
  body("cc").optional().isArray().withMessage("CC must be an array"),
  body("cc.*")
    .optional()
    .isEmail()
    .withMessage("All CC recipients must be valid email addresses"),
  body("scheduledAt")
    .optional()
    .isISO8601()
    .withMessage("Scheduled date must be a valid ISO 8601 date"),
  handleValidationErrors,
];

const validateBulkEmail = [
  body("templateId").isMongoId().withMessage("Valid template ID is required"),
  body("recipients")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Recipients must be an array with 1-1000 items"),
  body("recipients.*.email")
    .isEmail()
    .withMessage("All recipients must have valid email addresses"),
  body("subject")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Subject must be between 1 and 200 characters"),
  handleValidationErrors,
];

// Payment validation rules
const validatePayment = [
  body("plan")
    .isIn(["pro", "business"])
    .withMessage("Plan must be either pro or business"),
  body("billingCycle")
    .optional()
    .isIn(["monthly", "yearly"])
    .withMessage("Billing cycle must be either monthly or yearly"),
  body("gateway")
    .isIn(["stripe", "razorpay", "paypal"])
    .withMessage("Invalid payment gateway"),
  handleValidationErrors,
];

// Admin validation rules
const validateAdminUserUpdate = [
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
  body("subscription.plan")
    .optional()
    .isIn(["free", "pro", "business"])
    .withMessage("Plan must be free, pro, or business"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  handleValidationErrors,
];

// Parameter validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} must be a valid MongoDB ObjectId`),
  handleValidationErrors,
];

// Query validation
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("sort")
    .optional()
    .isIn(["createdAt", "-createdAt", "name", "-name", "usage", "-usage"])
    .withMessage("Invalid sort parameter"),
  handleValidationErrors,
];

const validateDateRange = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateTemplate,
  validateEmail,
  validateBulkEmail,
  validatePayment,
  validateAdminUserUpdate,
  validateObjectId,
  validatePagination,
  validateDateRange,
};
