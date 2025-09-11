import express from 'express';
import auth from '../middleware/auth.js';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../controllers/goalController.js';

const router = express.Router();

router.post('/', auth, createGoal);
router.get('/', auth, getGoals);
router.put('/:id', auth, updateGoal);
router.delete('/:id', auth, deleteGoal);

export default router;
