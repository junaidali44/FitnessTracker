import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify connection on startup
export const verifyEmailService = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error.message);
    return false;
  }
};

// Base email template
const emailTemplate = (title, body, buttonText, buttonUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #10b981, #3b82f6); padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
    .content { padding: 30px; color: #333333; line-height: 1.6; }
    .content h2 { color: #111827; margin-top: 0; }
    .button { display: inline-block; background: #10b981; color: #ffffff !important; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
    .highlight { background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💪 Fitness Tracker</h1>
    </div>
    <div class="content">
      <h2>${title}</h2>
      ${body}
      ${buttonText && buttonUrl ? `<div style="text-align: center;"><a href="${buttonUrl}" class="button">${buttonText}</a></div>` : ''}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Fitness Tracker. All rights reserved.</p>
      <p>You received this email because you have an account with us.</p>
    </div>
  </div>
</body>
</html>
`;

// Wellcome email
export const sendWelcomeEmail = async (user) => {
  try {
    const html = emailTemplate(
      `Welcome, ${user.fullName}! 🎉`,
      `
      <p>We're thrilled to have you on board. Your fitness journey starts now!</p>
      <div class="highlight">
        <strong>🎯 Your goal:</strong> ${user.fitnessGoals || 'General Fitness'}<br>
        <strong>💡 Pro tip:</strong> Log your first workout today to start your streak!
      </div>
      <p>Here's what you can do:</p>
      <ul>
        <li>📝 Track workouts with detailed exercises</li>
        <li>🍎 Log nutrition with auto-calculated macros</li>
        <li>📊 View progress charts and analytics</li>
        <li>🔔 Get reminded about your goals</li>
      </ul>
      `,
      'Go to Dashboard',
      `${process.env.APP_URL}/dashboard`
    );

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Fitness Tracker <noreply@fitnesstracker.com>',
      to: user.email,
      subject: `Welcome to Fitness Tracker, ${user.fullName.split(' ')[0]}! 💪`,
      html
    });

    console.log('📧 Welcome email sent:', info.messageId);
    console.log('🔗 Preview:', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('❌ Welcome email failed:', error.message);
    return false;
  }
};

// WORKOUT COMPLETION EMAIL 
export const sendWorkoutEmail = async (user, workout, streak) => {
  try {
    const html = emailTemplate(
      `Workout Complete! 💪`,
      `
      <p>Great job finishing <strong>${workout.name}</strong>!</p>
      <div class="highlight">
        <strong>⏱️ Duration:</strong> ${workout.duration} minutes<br>
        <strong>🔥 Calories burned:</strong> ${workout.caloriesBurned}<br>
        <strong>🏷️ Category:</strong> ${workout.category}<br>
        ${streak ? `<strong>🔥 Current streak:</strong> ${streak} day${streak > 1 ? 's' : ''}!` : ''}
      </div>
      <p>Keep up the amazing work. Every workout counts!</p>
      `,
      'View Workout',
      `${process.env.APP_URL}/workouts`
    );

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `✅ Workout logged: ${workout.name}`,
      html
    });

    console.log('📧 Workout email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Workout email failed:', error.message);
    return false;
  }
};

// PASSWORD RESET EMAIL 
export const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    const html = emailTemplate(
      `Password Reset Request 🔐`,
      `
      <p>You requested to reset your password. Click the button below to set a new one.</p>
      <div class="highlight">
        <strong>⏰ This link expires in 15 minutes.</strong>
      </div>
      <p>If you didn't request this, you can safely ignore this email. Your password won't change unless you click the link above.</p>
      `,
      'Reset Password',
      resetUrl
    );

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Reset Your Password - Fitness Tracker',
      html
    });

    console.log('📧 Password reset email sent:', info.messageId);
    console.log('🔗 Preview:', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('❌ Password reset email failed:', error.message);
    return false;
  }
};

// ============ CRON: MORNING MOTIVATION EMAIL ============
export const sendMorningMotivationEmail = async (user) => {
  try {
    const html = emailTemplate(
      `Good morning, ${user.fullName.split(' ')[0]}! ☀️`,
      `
      <p>Start your day with a win!</p>
      <div class="highlight">
        <strong>💪 Today's challenge:</strong> Complete one workout today.<br>
        <strong>🎯 Your goal:</strong> ${user.fitnessGoals || 'General Fitness'}<br>
        ${user.streak?.current > 0 ? `<strong>🔥 Don't break your ${user.streak.current}-day streak!</strong>` : ''}
      </div>
      <p>Even 15 minutes of activity counts. Let's go!</p>
      `,
      'Log Workout',
      `${process.env.APP_URL}/workouts`
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `☀️ Time to move, ${user.fullName.split(' ')[0]}!`,
      html
    });

    return true;
  } catch (error) {
    console.error('❌ Morning motivation email failed:', error.message);
    return false;
  }
};

// ============ CRON: DINNER REMINDER EMAIL ============
export const sendDinnerReminderEmail = async (user) => {
  try {
    const html = emailTemplate(
      `Don't forget dinner! 🍽️`,
      `
      <p>You haven't logged your dinner yet today.</p>
      <div class="highlight">
        <strong>📊 Why log meals?</strong><br>
        Tracking nutrition helps you hit your daily macro goals and stay accountable.
      </div>
      <p>Take 30 seconds to log your dinner and keep your streak going.</p>
      `,
      'Log Dinner',
      `${process.env.APP_URL}/nutrition`
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: '🍽️ Quick reminder: log your dinner',
      html
    });

    return true;
  } catch (error) {
    console.error('❌ Dinner reminder email failed:', error.message);
    return false;
  }
};

// ============ CRON: WEEKLY SUMMARY EMAIL ============
export const sendWeeklySummaryEmail = async (user, stats) => {
  try {
    const { workoutsCompleted, weeklyGoal, totalDuration, totalCalories, avgCalories, streak } = stats;
    const percent = Math.round((workoutsCompleted / weeklyGoal) * 100);
    const achieved = workoutsCompleted >= weeklyGoal;

    const html = emailTemplate(
      `Your Weekly Summary 📊`,
      `
      <p>Here's how your week went:</p>
      <div class="highlight">
        <strong>🏋️ Workouts completed:</strong> ${workoutsCompleted} / ${weeklyGoal} (${percent}%)<br>
        <strong>⏱️ Total time:</strong> ${totalDuration} minutes<br>
        <strong>🔥 Calories burned:</strong> ${totalCalories}<br>
        <strong>🍎 Average daily intake:</strong> ${avgCalories} calories<br>
        <strong>🔥 Streak:</strong> ${streak} day${streak > 1 ? 's' : ''}
      </div>
      ${achieved 
        ? '<p><strong>🎉 Goal achieved! You crushed it this week.</strong></p>'
        : `<p>You need ${weeklyGoal - workoutsCompleted} more workout${weeklyGoal - workoutsCompleted > 1 ? 's' : ''} to hit your weekly goal. Let's go!</p>`
      }
      `,
      'View Dashboard',
      `${process.env.APP_URL}/dashboard`
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `📊 Your weekly fitness summary (${workoutsCompleted}/${weeklyGoal} workouts)`,
      html
    });

    return true;
  } catch (error) {
    console.error('❌ Weekly summary email failed:', error.message);
    return false;
  }
};

// ============ FEEDBACK RESPONSE EMAIL ============
export const sendFeedbackResponseEmail = async (user, feedback) => {
  try {
    const html = emailTemplate(
      `Response to your feedback 📬`,
      `
      <p>An admin has responded to your feedback:</p>
      <div class="highlight">
        <strong>📝 Your feedback:</strong><br>
        ${feedback.subject}<br><br>
        <strong>💬 Admin response:</strong><br>
        ${feedback.adminResponse}
      </div>
      <p>Thank you for helping us improve Fitness Tracker!</p>
      `,
      'View Feedback',
      `${process.env.APP_URL}/feedback`
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Response to your feedback: ${feedback.subject}`,
      html
    });

    return true;
  } catch (error) {
    console.error('❌ Feedback response email failed:', error.message);
    return false;
  }
};