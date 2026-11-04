import User from '../models/User.js';
import Workout from '../models/Workout.js';

export const updateStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastActivity = user.streak?.lastActivity 
      ? new Date(user.streak.lastActivity) 
      : null;

    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      
      if (lastActivity.getTime() === today.getTime()) {
        // Already updated today
        return user.streak;
      }

      if (lastActivity.getTime() === yesterday.getTime()) {
        // Continue streak
        user.streak.current += 1;
      } else {
        // Streak broken
        user.streak.current = 1;
      }
    } else {
      // First activity
      user.streak.current = 1;
    }

    if (user.streak.current > user.streak.longest) {
      user.streak.longest = user.streak.current;
    }

    user.streak.lastActivity = new Date();
    await user.save();

    return user.streak;
  } catch (error) {
    console.error('Streak error:', error);
    return null;
  }
};

export const getStreak = async (userId) => {
  const user = await User.findById(userId).select('streak');
  return user?.streak || { current: 0, longest: 0 };
};