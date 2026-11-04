import express from 'express';
import {
  getProgress, getProgressById, createProgress, updateProgress,
  deleteProgress, getProgressChart
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/chart', getProgressChart);
router.get('/', getProgress);
router.get('/:id', getProgressById);
router.post('/', createProgress);
router.put('/:id', updateProgress);
router.delete('/:id', deleteProgress);

export default router;