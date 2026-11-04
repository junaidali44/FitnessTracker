import Progress from '../models/Progress.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { calculateProgressDelta } from '../services/calculationService.js';

export const getProgress = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const progress = await Progress.find({ user: req.user._id })
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Progress.countDocuments({ user: req.user._id });

  res.json({
    success: true,
    data: progress,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});

export const getProgressById = asyncHandler(async (req, res) => {
  const progress = await Progress.findOne({ 
    _id: req.params.id, 
    user: req.user._id 
  });
  
  if (!progress) {
    return res.status(404).json({ success: false, message: 'Progress not found' });
  }
  
  res.json({ success: true, data: progress });
});

export const createProgress = asyncHandler(async (req, res) => {
  const progress = await Progress.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json({
    success: true,
    message: 'Progress logged',
    data: progress
  });
});

export const updateProgress = asyncHandler(async (req, res) => {
  const progress = await Progress.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!progress) {
    return res.status(404).json({ success: false, message: 'Progress not found' });
  }

  res.json({
    success: true,
    message: 'Progress updated',
    data: progress
  });
});

export const deleteProgress = asyncHandler(async (req, res) => {
  const progress = await Progress.findOneAndDelete({ 
    _id: req.params.id, 
    user: req.user._id 
  });
  
  if (!progress) {
    return res.status(404).json({ success: false, message: 'Progress not found' });
  }
  
  res.json({ success: true, message: 'Progress deleted' });
});

export const getProgressChart = asyncHandler(async (req, res) => {
  const { days = 90 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const entries = await Progress.find({
    user: req.user._id,
    date: { $gte: startDate }
  }).sort({ date: 1 });

  // Chart data
  const weightChart = entries
    .filter(e => e.weight)
    .map(e => ({
      date: new Date(e.date).toISOString().split('T')[0],
      value: e.weight
    }));

  const bodyFatChart = entries
    .filter(e => e.bodyFat)
    .map(e => ({
      date: new Date(e.date).toISOString().split('T')[0],
      value: e.bodyFat
    }));

  // Performance charts
  const benchPressChart = entries
    .filter(e => e.performance?.benchPress)
    .map(e => ({
      date: new Date(e.date).toISOString().split('T')[0],
      value: e.performance.benchPress
    }));

  const pushupsChart = entries
    .filter(e => e.performance?.pushups)
    .map(e => ({
      date: new Date(e.date).toISOString().split('T')[0],
      value: e.performance.pushups
    }));

  // Calculate deltas
  const latest = entries[entries.length - 1];
  const previous = entries[entries.length - 2];
  const delta = latest && previous ? calculateProgressDelta(latest, previous) : null;

  res.json({
    success: true,
    data: {
      weightChart,
      bodyFatChart,
      performance: {
        benchPress: benchPressChart,
        pushups: pushupsChart
      },
      delta,
      latestEntry: latest || null
    }
  });
});