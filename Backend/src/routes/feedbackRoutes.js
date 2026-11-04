import express from 'express';
import {
  submitFeedback, getMyFeedback, getFeedbackById
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/', submitFeedback);
router.get('/', getMyFeedback);
router.get('/:id', getFeedbackById);

export default router;