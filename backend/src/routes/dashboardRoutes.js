import express from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected admin dashboard route mounted at /api/dashboard
router.get('/', authMiddleware, getDashboard);

export default router;
