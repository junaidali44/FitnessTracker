import { sendFeedbackResponseEmail } from '../services/emailService.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Nutrition from '../models/Nutrition.js';
import Progress from '../models/Progress.js';
import Feedback from '../models/Feedback.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalWorkouts,
    totalNutrition,
    totalProgress,
    totalFeedback,
    pendingFeedback
  ] = await Promise.all([
    User.countDocuments(),
    Workout.countDocuments(),
    Nutrition.countDocuments(),
    Progress.countDocuments(),
    Feedback.countDocuments(),
    Feedback.countDocuments({ status: 'Pending' })
  ]);

  // Recent users (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: weekAgo } });

  // Recent feedback
  const recentFeedback = await Feedback.find()
    .populate('user', 'fullName email')
    .sort({ createdAt: -1 })
    .limit(5);

  // Most active users (by workout count)
  const activeUsers = await Workout.aggregate([
    { $group: { _id: '$user', workoutCount: { $sum: 1 } } },
    { $sort: { workoutCount: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.fullName': 1, 'user.email': 1, workoutCount: 1 } }
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalWorkouts,
        totalNutrition,
        totalProgress,
        totalFeedback,
        pendingFeedback,
        newUsersThisWeek
      },
      recentFeedback,
      activeUsers
    }
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
export const getUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    data: users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Get user's data counts
  const [workoutCount, nutritionCount, progressCount] = await Promise.all([
    Workout.countDocuments({ user: user._id }),
    Nutrition.countDocuments({ user: user._id }),
    Progress.countDocuments({ user: user._id })
  ]);

  res.json({
    success: true,
    data: {
      user,
      counts: { workoutCount, nutritionCount, progressCount }
    }
  });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  if (!['User', 'Admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }

  // Prevent removing last admin
  if (role === 'User') {
    const adminCount = await User.countDocuments({ role: 'Admin' });
    const targetUser = await User.findById(req.params.id);
    if (targetUser?.role === 'Admin' && adminCount <= 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot remove the last admin' 
      });
    }
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({
    success: true,
    message: `User role updated to ${role}`,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Prevent deleting self
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ 
      success: false, 
      message: 'You cannot delete your own account' 
    });
  }

  // Prevent deleting last admin
  if (user.role === 'Admin') {
    const adminCount = await User.countDocuments({ role: 'Admin' });
    if (adminCount <= 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete the last admin' 
      });
    }
  }

  // Delete all user data
  await Promise.all([
    Workout.deleteMany({ user: user._id }),
    Nutrition.deleteMany({ user: user._id }),
    Progress.deleteMany({ user: user._id }),
    Feedback.deleteMany({ user: user._id }),
    user.deleteOne()
  ]);

  res.json({ success: true, message: 'User and all related data deleted' });
});

// @desc    Get all feedback
// @route   GET /api/admin/feedback
export const getAllFeedback = asyncHandler(async (req, res) => {
  const { status, type, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;

  const feedback = await Feedback.find(filter)
    .populate('user', 'fullName email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Feedback.countDocuments(filter);

  res.json({
    success: true,
    data: feedback,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});

// @desc    Respond to feedback
// @route   PUT /api/admin/feedback/:id/respond
export const respondToFeedback = asyncHandler(async (req, res) => {
  const { adminResponse, status } = req.body;

  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    {
      adminResponse,
      status: status || 'Resolved'
    },
    { new: true }
  ).populate('user', 'fullName email preferences');

  if (!feedback) {
    return res.status(404).json({ success: false, message: 'Feedback not found' });
  }

  // Send email notification
  if (feedback.user?.email && feedback.user?.preferences?.emailNotifications !== false) {
    sendFeedbackResponseEmail(feedback.user, {
      subject: feedback.subject,
      adminResponse: feedback.adminResponse
    }).catch(err => console.error('Feedback email failed:', err.message));
  }

  res.json({
    success: true,
    message: 'Feedback responded',
    data: feedback
  });
});
// @desc    Delete feedback
// @route   DELETE /api/admin/feedback/:id
export const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findByIdAndDelete(req.params.id);
  if (!feedback) {
    return res.status(404).json({ success: false, message: 'Feedback not found' });
  }
  res.json({ success: true, message: 'Feedback deleted' });
});

// @desc    Get system analytics
// @route   GET /api/admin/analytics
export const getSystemAnalytics = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  // Daily registrations
  const dailyRegistrations = await User.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Daily workouts
  const dailyWorkouts = await Workout.aggregate([
    { $match: { date: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        count: { $sum: 1 },
        totalCalories: { $sum: '$caloriesBurned' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Workout categories distribution
  const workoutCategories = await Workout.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // User roles distribution
  const userRoles = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);

  res.json({
    success: true,
    data: {
      dailyRegistrations,
      dailyWorkouts,
      workoutCategories,
      userRoles
    }
  });
});