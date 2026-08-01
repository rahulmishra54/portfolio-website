import express from 'express';
import authRoutes from './authRoutes.js';
import projectRoutes from './projectRoutes.js';
import blogRoutes from './blogRoutes.js';
import skillRoutes from './skillRoutes.js';
import experienceRoutes from './experienceRoutes.js';
import certificateRoutes from './certificateRoutes.js';
import messageRoutes from './messageRoutes.js';
import resumeRoutes from './resumeRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

// Mount resource routers under their paths
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/blogs', blogRoutes);
router.use('/skills', skillRoutes);
router.use('/experience', experienceRoutes);
router.use('/certificates', certificateRoutes);
router.use('/messages', messageRoutes);
router.use('/resume', resumeRoutes);
router.use('/settings', settingsRoutes);
router.use('/upload', uploadRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
