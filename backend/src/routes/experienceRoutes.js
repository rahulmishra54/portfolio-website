import express from 'express';
import {
  createExperience,
  getExperiences,
  getExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected create/update/delete
router.post('/', authMiddleware, createExperience);
router.get('/', getExperiences);
router.get('/:id', getExperience);
router.put('/:id', authMiddleware, updateExperience);
router.delete('/:id', authMiddleware, deleteExperience);

export default router;