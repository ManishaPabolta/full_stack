import { body } from 'express-validator';

export const validateSignup = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateTaskCreate = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Status must be todo, in-progress, or completed'),
];

export const validateTaskUpdate = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Status must be todo, in-progress, or completed'),
];
