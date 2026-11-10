import Workout from '../models/Workout.js';
import Nutrition from '../models/Nutrition.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Global search across workouts, nutrition, users
// @route   GET /api/search?q=bench
export const globalSearch = asyncHandler(async (req, res) => {
  const { q, type = 'all', limit = 10 } = req.query;

  if (!q || q.length < 2) {
    return res.status(400).json({ 
      success: false, 
      message: 'Search query must be at least 2 characters' 
    });
  }

  const searchRegex = { $regex: q, $options: 'i' };
  const results = {};

  // Search workouts
  if (type === 'all' || type === 'workouts') {
    results.workouts = await Workout.find({
      user: req.user._id,
      $or: [
        { name: searchRegex },
        { 'exercises.name': searchRegex },
        { tags: searchRegex },
        { notes: searchRegex }
      ]
    })
      .limit(parseInt(limit))
      .select('name category date duration caloriesBurned');
  }

  // Search nutrition
  if (type === 'all' || type === 'nutrition') {
    results.nutrition = await Nutrition.find({
      user: req.user._id,
      $or: [
        { 'foods.name': searchRegex },
        { notes: searchRegex }
      ]
    })
      .limit(parseInt(limit))
      .select('mealType foods totalCalories date');
  }

  // Search users (only if public search allowed)
  if (type === 'all' || type === 'users') {
    results.users = await User.find({
      $or: [
        { fullName: searchRegex },
        { email: searchRegex }
      ],
      _id: { $ne: req.user._id } // exclude self
    })
      .limit(5)
      .select('fullName email profilePicture fitnessGoals');
  }

  res.json({
    success: true,
    query: q,
    data: results,
    counts: {
      workouts: results.workouts?.length || 0,
      nutrition: results.nutrition?.length || 0,
      users: results.users?.length || 0
    }
  });
});