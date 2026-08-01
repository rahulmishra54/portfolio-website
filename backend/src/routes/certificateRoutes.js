
import express from 'express';
import {
  createCertificate,
  getCertificates,
  getCertificate,
  updateCertificate,
  deleteCertificate,
} from '../controllers/certificateController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Protected create/update/delete routes with upload middleware
router.post('/', authMiddleware, upload.single('image'), createCertificate);
router.get('/', getCertificates);
router.get('/:id', getCertificate);
router.put('/:id', authMiddleware, upload.single('image'), updateCertificate);
router.delete('/:id', authMiddleware, deleteCertificate);

export default router;