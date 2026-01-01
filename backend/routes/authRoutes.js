import express from 'express';
import {
  signup,
  login,
  getProfile,
  updateProfile,
  refreshToken,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { validateSignup, validateLogin } from '../utils/validators.js';

const router = express.Router();

// Public routes
router.post('/signup', validateSignup, handleValidationErrors, signup);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
