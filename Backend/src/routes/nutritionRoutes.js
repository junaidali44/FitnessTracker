import express from 'express';
import {
  getNutrition, getNutritionById, createNutrition, updateNutrition,
  deleteNutrition, getNutritionAnalytics
} from '../controllers/nutritionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/analytics', getNutritionAnalytics);
router.get('/', getNutrition);
router.get('/:id', getNutritionById);
router.post('/', createNutrition);
router.put('/:id', updateNutrition);
router.delete('/:id', deleteNutrition);

export default router;