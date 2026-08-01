import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';
import { uploadImages, uploadResumeFile } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/image', authMiddleware, upload.array('file', 10), uploadImages);
router.post('/resume', authMiddleware, upload.single('file'), uploadResumeFile);

export default router;
