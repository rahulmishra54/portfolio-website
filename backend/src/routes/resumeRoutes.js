import express from 'express';
import {
  uploadResume,
  getResume,
  replaceResume,
  deleteResume,
} from '../controllers/resumeController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Protected admin endpoints for upload/replace/delete
router.post('/', authMiddleware, upload.single('resume'), uploadResume);
router.get('/', getResume);
router.put('/', authMiddleware, upload.single('resume'), replaceResume);
router.delete('/', authMiddleware, deleteResume);

export default router;