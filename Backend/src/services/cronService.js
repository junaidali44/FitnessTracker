import cron from 'node-cron';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Nutrition from '../models/Nutrition.js';
import { createNotification } from './notificationService.js';
import {
  sendMorningMotivationEmail,
  sendDinnerReminderEmail,
  sendWeeklySummaryEmail
} from './emailService.js';
import { getTodayRange } from '../utils/dateHelper.js';

const shouldNotify = (user) => {
  return user.preferences?.notifications !== false || 
         user.preferences?.emailNotifications !== false;
};

export const startCronJobs = () => {
  if (process.env.ENABLE_CRON !== 'true') {
    console.log('⏰ Cron jobs disabled');
    return;
  }

  // ============ MORNING MOTIVATION - 9 AM DAILY ============
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Running morning motivation job');
    try {
      const users = await User.find({ 'preferences.notifications': { $ne: false } });
      const { start, end } = getTodayRange();

      for (const user of users) {
        const todayWorkout = await Workout.findOne({
          user: user._id,
          date: { $gte: start, $lte: end }
        });

        if (!todayWorkout) {
          // In-app notification
          await createNotification(
            user._id,
            'Reminder',
            '💪 Time to move!',
            'Start your day with a workout. Even 15 minutes counts!'
          );

          // Email notification
          if (user.preferences?.emailNotifications !== false) {
            sendMorningMotivationEmail(user).catch(err =>
              console.error('Morning email failed:', err.message)
            );
          }
        }
      }
      console.log('✅ Morning motivation job complete');
    } catch (error) {
      console.error('❌ Morning motivation error:', error);
    }
  });

  // ============ DINNER REMINDER - 8 PM DAILY ============
  cron.schedule('0 20 * * *', async () => {
    console.log('⏰ Running dinner reminder job');
    try {
      const users = await User.find({ 'preferences.notifications': { $ne: false } });
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

          if (user.preferences?.emailNotifications !== false) {
            sendDinnerReminderEmail(user).catch(err =>
              console.error('Dinner email failed:', err.message)
            );
          }
        }
      }
      console.log('✅ Dinner reminder job complete');
    } catch (error) {
      console.error('❌ Dinner reminder error:', error);
    }
  });

  // ============ WEEKLY SUMMARY - SUNDAY 8 PM ============
  cron.schedule('0 20 * * 0', async () => {
    console.log('⏰ Running weekly summary job');
    try {
      const users = await User.find({ 'preferences.notifications': { $ne: false } });
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      for (const user of users) {
        const workouts = await Workout.find({
          user: user._id,
          date: { $gte: weekAgo }
        });

        const nutrition = await Nutrition.find({
          user: user._id,
          date: { $gte: weekAgo }
        });

        const weeklyGoal = user.preferences?.weeklyGoal || 5;
        const totalCalories = workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
        const totalDuration = workouts.reduce((s, w) => s + (w.duration || 0), 0);
        const avgCalories = nutrition.length > 0
          ? Math.round(nutrition.reduce((s, n) => s + (n.totalCalories || 0), 0) / 7)
          : 0;

        // In-app notification
        await createNotification(
          user._id,
          'Goal',
          '📊 Weekly Summary',
          `You completed ${workouts.length}/${weeklyGoal} workouts this week. ${workouts.length >= weeklyGoal ? 'Goal achieved! 🎉' : 'Keep pushing next week! 💪'}`
        );

        // Email notification
        if (user.preferences?.emailNotifications !== false) {
          sendWeeklySummaryEmail(user, {
            workoutsCompleted: workouts.length,
            weeklyGoal,
            totalDuration,
            totalCalories,
            avgCalories,
            streak: user.streak?.current || 0
          }).catch(err =>
            console.error('Weekly email failed:', err.message)
          );
        }
      }
      console.log('✅ Weekly summary job complete');
    } catch (error) {
      console.error('❌ Weekly summary error:', error);
    }
  });

  console.log('✅ Cron jobs started (emails enabled)');
};