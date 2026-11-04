import express from 'express';
import {
  getWorkouts, getWorkoutById, createWorkout, updateWorkout, 
  deleteWorkout, getWorkoutAnalytics
} from '../controllers/workoutController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/analytics', getWorkoutAnalytics);
router.get('/', getWorkouts);
router.get('/:id', getWorkoutById);
router.post('/', createWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

export default router;