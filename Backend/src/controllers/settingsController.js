import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getSettings = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      preferences: req.user.preferences,
      fitnessGoals: req.user.fitnessGoals
    }
  });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const { preferences, fitnessGoals } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...(preferences && { 
        preferences: { ...req.user.preferences, ...preferences } 
      }),
      ...(fitnessGoals && { fitnessGoals })
    },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Settings updated',
    data: {
      preferences: user.preferences,
      fitnessGoals: user.fitnessGoals
    }
  });
});