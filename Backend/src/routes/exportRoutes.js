import express from 'express';
import {
  exportWorkouts, exportNutrition, exportProgress
} from '../controllers/exportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/workouts', exportWorkouts);
router.get('/nutrition', exportNutrition);
router.get('/progress', exportProgress);

export default router;