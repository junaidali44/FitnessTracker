import Nutrition from '../models/Nutrition.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { calculateNutritionTotals } from '../services/calculationService.js';

export const getNutrition = asyncHandler(async (req, res) => {
  const { mealType, date, page = 1, limit = 20 } = req.query;

  const filter = { user: req.user._id };
  if (mealType) filter.mealType = mealType;
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  const nutrition = await Nutrition.find(filter)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Nutrition.countDocuments(filter);

  res.json({
    success: true,
    data: nutrition,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});

export const getNutritionById = asyncHandler(async (req, res) => {
  const entry = await Nutrition.findOne({ _id: req.params.id, user: req.user._id });
  if (!entry) {
    return res.status(404).json({ success: false, message: 'Entry not found' });
  }
  res.json({ success: true, data: entry });
});

export const createNutrition = asyncHandler(async (req, res) => {
  const { foods = [], ...rest } = req.body;

  // Auto-calculate totals
  const totals = calculateNutritionTotals(foods);

  const nutrition = await Nutrition.create({
    ...rest,
    foods,
    ...totals,
    user: req.user._id
  });

  res.status(201).json({
    success: true,
    message: 'Meal logged',
    data: nutrition
  });
});

export const updateNutrition = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  // Recalculate totals if foods changed
  if (data.foods) {
    const totals = calculateNutritionTotals(data.foods);
    Object.assign(data, totals);
  }

  const nutrition = await Nutrition.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    data,
    { new: true, runValidators: true }
  );

  if (!nutrition) {
    return res.status(404).json({ success: false, message: 'Entry not found' });
  }

  res.json({
    success: true,
    message: 'Meal updated',
    data: nutrition
  });
});

export const deleteNutrition = asyncHandler(async (req, res) => {
  const nutrition = await Nutrition.findOneAndDelete({ 
    _id: req.params.id, 
    user: req.user._id 
  });
  
  if (!nutrition) {
    return res.status(404).json({ success: false, message: 'Entry not found' });
  }
  
  res.json({ success: true, message: 'Entry deleted' });
});

export const getNutritionAnalytics = asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const entries = await Nutrition.find({
    user: req.user._id,
    date: { $gte: startDate }
  });

  // Daily totals
  const dailyTotals = {};
  entries.forEach(n => {
    const day = new Date(n.date).toISOString().split('T')[0];
    if (!dailyTotals[day]) {
      dailyTotals[day] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    dailyTotals[day].calories += n.totalCalories || 0;
    dailyTotals[day].protein += n.totalProtein || 0;
    dailyTotals[day].carbs += n.totalCarbs || 0;
    dailyTotals[day].fat += n.totalFat || 0;
  });

  const daysArray = Object.values(dailyTotals);
  const avgCalories = daysArray.length 
    ? Math.round(daysArray.reduce((s, d) => s + d.calories, 0) / daysArray.length)
    : 0;
  const avgProtein = daysArray.length 
    ? Math.round(daysArray.reduce((s, d) => s + d.protein, 0) / daysArray.length)
    : 0;

  res.json({
    success: true,
    data: {
      dailyTotals,
      avgCalories,
      avgProtein,
      avgCarbs: daysArray.length 
        ? Math.round(daysArray.reduce((s, d) => s + d.carbs, 0) / daysArray.length)
        : 0,
      avgFat: daysArray.length 
        ? Math.round(daysArray.reduce((s, d) => s + d.fat, 0) / daysArray.length)
        : 0,
      totalEntries: entries.length
    }
  });
});