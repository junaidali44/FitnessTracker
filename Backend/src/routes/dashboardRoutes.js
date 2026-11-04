import express from 'express';
import {
  getDashboard, getWeeklySummary, getMonthlySummary
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', getDashboard);
router.get('/weekly', getWeeklySummary);
router.get('/monthly', getMonthlySummary);

export default router;