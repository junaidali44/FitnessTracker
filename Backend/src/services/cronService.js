import cron from 'node-cron';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Nutrition from '../models/Nutrition.js';
import { createNotification } from './notificationService.js';
import { getTodayRange } from '../utils/dateHelper.js';

export const startCronJobs = () => {
  if (process.env.ENABLE_CRON !== 'true') {
    console.log('⏰ Cron jobs disabled');
    return;
  }

  // Daily 8 PM: Remind users who haven't logged dinner
  cron.schedule('0 20 * * *', async () => {
    console.log('⏰ Running dinner reminder job');
    try {
      const users = await User.find({ 'preferences.notifications': true });
      const { start, end } = getTodayRange();

      for (const user of users) {
        const dinnerLogged = await Nutrition.findOne({
          user: user._id,
          mealType: 'Dinner',
          date: { $gte: start, $lte: end }
        });

        if (!dinnerLogged) {
          await createNotification(
            user._id,
            'Reminder',
            '🍽️ Don\'t forget dinner!',
            'You haven\'t logged your dinner yet. Keep your nutrition on track!'
          );
        }
      }
    } catch (error) {
      console.error('Dinner reminder error:', error);
    }
  });

  // Daily 9 AM: Motivate users who haven't worked out
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Running morning motivation job');
    try {
      const users = await User.find({ 'preferences.notifications': true });
      const { start, end } = getTodayRange();

      for (const user of users) {
        const todayWorkout = await Workout.findOne({
          user: user._id,
          date: { $gte: start, $lte: end }
        });

        if (!todayWorkout) {
          await createNotification(
            user._id,
            'Reminder',
            '💪 Time to move!',
            'Start your day with a workout. Even 15 minutes counts!'
          );
        }
      }
    } catch (error) {
      console.error('Morning motivation error:', error);
    }
  });

  // Weekly Sunday 8 PM: Weekly summary
  cron.schedule('0 20 * * 0', async () => {
    console.log('⏰ Running weekly summary job');
    try {
      const users = await User.find({ 'preferences.notifications': true });
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      for (const user of users) {
        const weeklyWorkouts = await Workout.countDocuments({
          user: user._id,
          date: { $gte: weekAgo }
        });

        const goal = user.preferences?.weeklyGoal || 5;

        await createNotification(
          user._id,
          'Goal',
          '📊 Weekly Summary',
          `You completed ${weeklyWorkouts}/${goal} workouts this week. ${weeklyWorkouts >= goal ? 'Goal achieved! 🎉' : 'Keep pushing next week! 💪'}`
        );
      }
    } catch (error) {
      console.error('Weekly summary error:', error);
    }
  });

  console.log('✅ Cron jobs started');
};