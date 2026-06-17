const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  next();
};

const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 2, max: 100 }).withMessage('Title must be 2–100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Task description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(VALID_STATUSES).withMessage('Status must be Pending, In Progress, or Completed'),
  body('priority')
    .notEmpty().withMessage('Priority is required')
    .isIn(VALID_PRIORITIES).withMessage('Priority must be Low, Medium, or High'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid date'),
  handleValidationErrors,
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ min: 2, max: 100 }).withMessage('Title must be 2–100 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(VALID_STATUSES).withMessage('Status must be Pending, In Progress, or Completed'),
  body('priority')
    .optional()
    .isIn(VALID_PRIORITIES).withMessage('Priority must be Low, Medium, or High'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid date'),
  handleValidationErrors,
];

module.exports = { createTaskValidation, updateTaskValidation };
