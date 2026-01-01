import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { validateTaskCreate, validateTaskUpdate } from '../utils/validators.js';

const router = express.Router();

// All task routes are protected
router.use(protect);

router.post('/', validateTaskCreate, handleValidationErrors, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', validateTaskUpdate, handleValidationErrors, updateTask);
router.delete('/:id', deleteTask);

export default router;
