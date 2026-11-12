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
    await transporter.verify(); // ✅ Properly awaits the Promise
    console.log('✅ SMTP Server is ready to take messages');
    return true;
  } catch (error) {
    console.error('❌ SMTP Connection Error:', error.message);
    return false;
  }
};

// ============================================
// PREMIUM MATTE BLACK & CRIMSON RED TEMPLATE
// ============================================
const emailTemplate = (title, body, buttonText, buttonUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Reset styles for email clients */
    body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    table { border-collapse: collapse; width: 100%; }
    .wrapper { background-color: #0a0a0a; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #141414; border: 1px solid #262626; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.4); }
    
    /* Header */
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%); padding: 30px; text-align: center; border-bottom: 1px solid #262626; }
    .header h1 { color: #fafafa; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header span { color: #dc2626; } /* Crimson Red Accent */
    
    /* Content */
    .content { padding: 40px 30px; color: #a1a1aa; line-height: 1.6; font-size: 15px; }
    .content h2 { color: #fafafa; margin-top: 0; font-size: 20px; font-weight: 600; margin-bottom: 20px; }
    .content p { margin: 0 0 16px 0; }
    .content strong { color: #fafafa; font-weight: 600; }
    .content ul { padding-left: 20px; margin-bottom: 20px; }
    .content li { margin-bottom: 8px; }
    
    /* Highlight Box */
    .highlight { background-color: #1a1a1a; border-left: 4px solid #dc2626; padding: 20px; border-radius: 0 8px 8px 0; margin: 24px 0; color: #d4d4d8; }
    .highlight strong { color: #fafafa; display: block; margin-bottom: 8px; }
    
    /* Button */
    .btn-wrapper { text-align: center; margin: 32px 0; }
    .button { display: inline-block; background-color: #dc2626; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 0 20px rgba(220,38,38,0.25); }
    
    /* Footer */
    .footer { background-color: #0f0f0f; padding: 24px; text-align: center; color: #52525b; font-size: 12px; border-top: 1px solid #262626; }
    .footer p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Fit<span>Track</span></h1>
      </div>
      <div class="content">
        <h2>${title}</h2>
        ${body}
        ${buttonText && buttonUrl ? `<div class="btn-wrapper"><a href="${buttonUrl}" class="button">${buttonText}</a></div>` : ''}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} FitTrack. All rights reserved.</p>
        <p>Built by Syed Junaid ALi</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const sendWelcomeEmail = async (user) => {
  try {
    const html = emailTemplate(
      `Welcome, ${user.fullName.split(' ')[0]}!`,
      `
      <p>We're thrilled to have you on board. Your fitness journey starts now.</p>
      <div class="highlight">
        <strong>🎯 Goal: ${user.fitnessGoals || 'General Fitness'}</strong>
        <p style="margin: 0;">Pro tip: Log your first workout today to start your streak!</p>
      </div>
      <p>Here is what you can do with FitTrack:</p>
      <ul>
        <li>Track workouts with detailed exercises</li>
        <li>Log nutrition with auto-calculated macros</li>
        <li>View progress charts and analytics</li>
        <li>Get reminded about your goals</li>
      </ul>
      `,
      'Go to Dashboard',
      `${process.env.APP_URL}/dashboard`
    );

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"FitTrack" <noreply@fitnesstracker.com>',
      to: user.email,
      subject: `Welcome to FitTrack, ${user.fullName.split(' ')[0]}!`,
      html
    });

    console.log('📧 Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Welcome email failed:', error.message);
    return false;
  }
};

// ============ WORKOUT COMPLETION EMAIL ============
export const sendWorkoutEmail = async (user, workout, streak) => {
  try {
    const html = emailTemplate(
      `Workout Complete!`,
      `
      <p>Great job finishing <strong>${workout.name}</strong>.</p>
      <div class="highlight">
        <strong>Workout Summary</strong>
        <p style="margin: 4px 0;">⏱ Duration: ${workout.duration} minutes</p>
        <p style="margin: 4px 0;">🔥 Calories burned: ${workout.caloriesBurned}</p>
        <p style="margin: 4px 0;">🏷 Category: ${workout.category}</p>
        ${streak ? `<p style="margin: 4px 0;">🔥 Current streak: ${streak} day${streak > 1 ? 's' : ''}!</p>` : ''}
      </div>
      <p>Keep up the amazing work. Every workout counts.</p>
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

// ============ PASSWORD RESET EMAIL ============
export const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    const html = emailTemplate(
      `Reset Your Password`,
      `
      <p>We received a request to reset the password for your FitTrack account.</p>
      <p>Click the button below to choose a new password. This link is valid for 15 minutes.</p>
      <div class="highlight">
        <strong>Security Notice</strong>
        <p style="margin: 0;">If you didn't request this, you can safely ignore this email. Your password won't change unless you click the link above.</p>
      </div>
      `,
      'Reset Password',
      resetUrl
    );

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Reset Your Password - FitTrack',
      html
    });

    console.log('📧 Password reset email sent:', info.messageId);
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
      `Good morning, ${user.fullName.split(' ')[0]}`,
      `
      <p>Start your day with a win.</p>
      <div class="highlight">
        <strong>Today's Challenge</strong>
        <p style="margin: 4px 0;">Complete one workout today.</p>
        <p style="margin: 4px 0;">🎯 Your goal: ${user.fitnessGoals || 'General Fitness'}</p>
        ${user.streak?.current > 0 ? `<p style="margin: 4px 0;">🔥 Don't break your ${user.streak.current}-day streak!</p>` : ''}
      </div>
      <p>Even 15 minutes of activity counts. Let's go.</p>
      `,
      'Log Workout',
      `${process.env.APP_URL}/workouts`
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `☀️ Time to move, ${user.fullName.split(' ')[0]}`,
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
      `Don't forget dinner`,
      `
      <p>You haven't logged your dinner yet today.</p>
      <div class="highlight">
        <strong>Why log meals?</strong>
        <p style="margin: 0;">Tracking nutrition helps you hit your daily macro goals and stay accountable.</p>
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
      `Your Weekly Summary`,
      `
      <p>Here is how your week went.</p>
      <div class="highlight">
        <strong>Weekly Stats</strong>
        <p style="margin: 4px 0;">🏋 Workouts completed: ${workoutsCompleted} / ${weeklyGoal} (${percent}%)</p>
        <p style="margin: 4px 0;">⏱ Total time: ${totalDuration} minutes</p>
        <p style="margin: 4px 0;">🔥 Calories burned: ${totalCalories}</p>
        <p style="margin: 4px 0;">🍎 Average daily intake: ${avgCalories} calories</p>
        <p style="margin: 4px 0;">🔥 Streak: ${streak} day${streak > 1 ? 's' : ''}</p>
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
      `Response to your feedback`,
      `
      <p>An admin has responded to your feedback.</p>
      <div class="highlight">
        <strong>Your feedback:</strong>
        <p style="margin: 4px 0 12px 0; color: #a1a1aa;">${feedback.subject}</p>
        <strong>Admin response:</strong>
        <p style="margin: 4px 0; color: #fafafa;">${feedback.adminResponse}</p>
      </div>
      <p>Thank you for helping us improve FitTrack.</p>
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