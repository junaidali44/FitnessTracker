import Feedback from '../models/Feedback.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const submitFeedback = asyncHandler(async (req, res) => {
  const { type, subject, message } = req.body;

  const feedback = await Feedback.create({
    user: req.user._id,
    type,
    subject,
    message
  });

  res.status(201).json({
    success: true,
    message: 'Thank you for your feedback!',
    data: feedback
  });
});

export const getMyFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: feedback });
});

export const getFeedbackById = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!feedback) {
    return res.status(404).json({ success: false, message: 'Feedback not found' });
  }

  res.json({ success: true, data: feedback });
});