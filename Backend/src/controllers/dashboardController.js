import Workout from '../models/Workout.js';
import Nutrition from '../models/Nutrition.js';
import Progress from '../models/Progress.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getTodayRange, getDateRange } from '../utils/dateHelper.js';
import { getStreak } from '../services/streakService.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const { start: todayStart, end: todayEnd } = getTodayRange();
  const { start: weekStart } = getDateRange(7);

  // Today's data
  const [todayWorkouts, todayMeals] = await Promise.all([
    Workout.find({
      user: req.user._id,
      date: { $gte: todayStart, $lte: todayEnd }
    }),
    Nutrition.find({
      user: req.user._id,
      date: { $gte: todayStart, $lte: todayEnd }
    })
  ]);

  // Week data
  const [weekWorkouts, weekMeals] = await Promise.all([
    Workout.find({ user: req.user._id, date: { $gte: weekStart } }),
    Nutrition.find({ user: req.user._id, date: { $gte: weekStart } })
  ]);

  // Get latest progress
  const latestProgress = await Progress.findOne({ user: req.user._id })
    .sort({ date: -1 });

  // Calculate today's totals
  const todayCaloriesBurned = todayWorkouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
  const todayCaloriesConsumed = todayMeals.reduce((s, n) => s + (n.totalCalories || 0), 0);
  const todayProtein = todayMeals.reduce((s, n) => s + (n.totalProtein || 0), 0);

  // Week stats
  const weekCaloriesBurned = weekWorkouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
  const weekTotalDuration = weekWorkouts.reduce((s, w) => s + (w.duration || 0), 0);

  // Streak
  const streak = await getStreak(req.user._id);

  res.json({
    success: true,
    data: {
      user: {
        fullName: req.user.fullName,
        fitnessGoals: req.user.fitnessGoals,
        profilePicture: req.user.profilePicture
      },
      today: {
        workouts: todayWorkouts.length,
        workoutsList: todayWorkouts,
        caloriesBurned: todayCaloriesBurned,
        meals: todayMeals.length,
        caloriesConsumed: todayCaloriesConsumed,
        protein: todayProtein
      },
      thisWeek: {
        workoutsCompleted: weekWorkouts.length,
        totalDuration: weekTotalDuration,
        caloriesBurned: weekCaloriesBurned,
        avgCaloriesPerDay: weekMeals.length > 0 
          ? Math.round(weekMeals.reduce((s, n) => s + (n.totalCalories || 0), 0) / 7)
          : 0
      },
      latestProgress,
      streak
    }
  });
});

export const getWeeklySummary = asyncHandler(async (req, res) => {
  const { start } = getDateRange(7);

  const workouts = await Workout.find({
    user: req.user._id,
    date: { $gte: start }
  });

  const nutrition = await Nutrition.find({
    user: req.user._id,
    date: { $gte: start }
  });

  // Group by day
  const dailyWorkouts = {};
  workouts.forEach(w => {
    const day = new Date(w.date).toISOString().split('T')[0];
    dailyWorkouts[day] = (dailyWorkouts[day] || 0) + 1;
  });

  const dailyCalories = {};
  nutrition.forEach(n => {
    const day = new Date(n.date).toISOString().split('T')[0];
    dailyCalories[day] = (dailyCalories[day] || 0) + (n.totalCalories || 0);
  });

  res.json({
    success: true,
    data: {
      workouts: workouts.length,
      totalDuration: workouts.reduce((s, w) => s + (w.duration || 0), 0),
      caloriesBurned: workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0),
      caloriesConsumed: nutrition.reduce((s, n) => s + (n.totalCalories || 0), 0),
      dailyWorkouts,
      dailyCalories
    }
  });
});

export const getMonthlySummary = asyncHandler(async (req, res) => {
  const { start } = getDateRange(30);

  const workouts = await Workout.find({
    user: req.user._id,
    date: { $gte: start }
  });

  const nutrition = await Nutrition.find({
    user: req.user._id,
    date: { $gte: start }
  });

  res.json({
    success: true,
    data: {
      workouts: workouts.length,
      totalDuration: workouts.reduce((s, w) => s + (w.duration || 0), 0),
      caloriesBurned: workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0),
      caloriesConsumed: nutrition.reduce((s, n) => s + (n.totalCalories || 0), 0),
      avgWorkoutsPerWeek: Math.round(workouts.length / 4.3)
    }
  });
});