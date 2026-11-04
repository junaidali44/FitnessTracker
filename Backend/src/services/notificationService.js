import Notification from '../models/Notification.js';

export const createNotification = async (userId, type, title, message) => {
  try {
    return await Notification.create({ user: userId, type, title, message });
  } catch (error) {
    console.error('Notification error:', error);
    return null;
  }
};

export const notifyWorkoutComplete = async (userId, workoutName, calories) => {
  return createNotification(
    userId,
    'Workout',
    '💪 Workout Complete!',
    `Great job finishing "${workoutName}"! You burned ${calories} calories.`
  );
};

export const notifyStreakMilestone = async (userId, streak) => {
  return createNotification(
    userId,
    'Goal',
    `🔥 ${streak} Day Streak!`,
    `You're on fire! Keep up the amazing work.`
  );
};

export const notifyWeeklyGoal = async (userId, completed, goal) => {
  return createNotification(
    userId,
    'Goal',
    '📊 Weekly Progress',
    `You've completed ${completed} out of ${goal} workouts this week.`
  );
};