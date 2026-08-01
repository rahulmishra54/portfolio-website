import express from 'express';
import {
  createSkill,
  getSkills,
  getSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import authMiddleware from '../middleware/authMiddleware.js';

// Router for Skill resources
const router = express.Router();

// Public: list all skills
router.get('/', getSkills);

// Public: get a single skill by id
router.get('/:id', getSkill);

// Protected: create a new skill (admin)
router.post('/', authMiddleware, createSkill);

// Protected: update an existing skill (admin)
router.put('/:id', authMiddleware, updateSkill);

// Protected: delete a skill (admin)
router.delete('/:id', authMiddleware, deleteSkill);

export default router;
