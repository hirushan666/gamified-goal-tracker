import express from 'express';
import auth from '../middleware/auth.js';
import { getProgress } from '../controllers/progressController.js';

const router = express.Router();

router.get('/', auth, getProgress);

export default router;
