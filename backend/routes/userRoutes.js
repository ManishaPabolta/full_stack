import express from 'express';
import { protect } from '../middleware/auth.js';
import { getProfile, updateProfile, changePassword } from '../controllers/userController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profilePhoto'), updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
