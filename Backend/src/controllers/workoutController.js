import { sendWorkoutEmail } from '../services/emailService.js';
import Workout from '../models/Workout.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { calculateWorkoutCalories } from '../services/calculationService.js';
import { notifyWorkoutComplete } from '../services/notificationService.js';
import { updateStreak } from '../services/streakService.js';

export const getWorkouts = asyncHandler(async (req, res) => {
  const { category, startDate, endDate, search, page = 1, limit = 20 } = req.query;

  const filter = { user: req.user._id };
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const workouts = await Workout.find(filter)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Workout.countDocuments(filter);

  res.json({
    success: true,
    data: workouts,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});

export const getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
  if (!workout) {
    return res.status(404).json({ success: false, message: 'Workout not found' });
  }
  res.json({ success: true, data: workout });
});

export const createWorkout = asyncHandler(async (req, res) => {
  const data = { ...req.body, user: req.user._id };

  if (!data.caloriesBurned && data.duration && data.category) {
    data.caloriesBurned = calculateWorkoutCalories(data.duration, data.category);
  }

  const workout = await Workout.create(data);

  // In-app notification
  await notifyWorkoutComplete(req.user._id, workout.name, workout.caloriesBurned);
  
  // Update streak
  const streakData = await updateStreak(req.user._id);

  // Email notification (if user has email notifications enabled)
  if (req.user.preferences?.emailNotifications !== false) {
    sendWorkoutEmail(req.user, workout, streakData?.current).catch(err =>
      console.error('Workout email failed:', err.message)
    );
  }

  res.status(201).json({
    success: true,
    message: 'Workout logged successfully',
    data: workout
  });
});

export const updateWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!workout) {
    return res.status(404).json({ success: false, message: 'Workout not found' });
  }
  
  res.json({
    success: true,
    message: 'Workout updated',
    data: workout
  });
});

export const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findOneAndDelete({ 
    _id: req.params.id, 
    user: req.user._id 
  });
  
  if (!workout) {
    return res.status(404).json({ success: false, message: 'Workout not found' });
  }
  
  res.json({ success: true, message: 'Workout deleted' });
});

export const getWorkoutAnalytics = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const workouts = await Workout.find({
    user: req.user._id,
    date: { $gte: startDate }
  });

  // Category breakdown
  const byCategory = workouts.reduce((acc, w) => {
    acc[w.category] = (acc[w.category] || 0) + 1;
    return acc;
  }, {});

  // Daily calories
  const caloriesByDay = workouts.reduce((acc, w) => {
    const day = new Date(w.date).toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + (w.caloriesBurned || 0);
    return acc;
  }, {});

  // Weekly frequency
  const weeklyFrequency = workouts.reduce((acc, w) => {
    const week = getWeekNumber(new Date(w.date));
    acc[week] = (acc[week] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      totalWorkouts: workouts.length,
      totalDuration: workouts.reduce((s, w) => s + (w.duration || 0), 0),
      totalCalories: workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0),
      byCategory,
      caloriesByDay,
      weeklyFrequency,
      averageDuration: workouts.length 
        ? Math.round(workouts.reduce((s, w) => s + (w.duration || 0), 0) / workouts.length)
        : 0
    }
  });
});

// Helper function
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}