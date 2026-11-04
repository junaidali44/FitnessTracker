import Workout from '../models/Workout.js';
import Nutrition from '../models/Nutrition.js';
import Progress from '../models/Progress.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateCSV, generateWorkoutsPDF, generateNutritionPDF } from '../services/exportService.js';
import PDFDocument from 'pdfkit';

export const exportWorkouts = asyncHandler(async (req, res) => {
  const { format = 'csv', startDate, endDate } = req.query;

  const filter = { user: req.user._id };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const workouts = await Workout.find(filter).sort({ date: -1 });

  if (format === 'csv') {
    const fields = [
      { label: 'Date', value: row => new Date(row.date).toLocaleDateString() },
      { label: 'Name', value: 'name' },
      { label: 'Category', value: 'category' },
      { label: 'Duration (min)', value: 'duration' },
      { label: 'Calories', value: 'caloriesBurned' },
      { label: 'Difficulty', value: 'difficulty' },
      { label: 'Exercises', value: row => row.exercises.map(e => e.name).join('; ') }
    ];

    const csv = generateCSV(workouts.map(w => w.toObject()), fields);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=workouts.csv');
    return res.send(csv);
  }

  // PDF
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=workouts.pdf');
  
  doc.pipe(res);
  generateWorkoutsPDF(doc, workouts, req.user);
  doc.end();
});

export const exportNutrition = asyncHandler(async (req, res) => {
  const { format = 'csv', startDate, endDate } = req.query;

  const filter = { user: req.user._id };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const entries = await Nutrition.find(filter).sort({ date: -1 });

  if (format === 'csv') {
    const fields = [
      { label: 'Date', value: row => new Date(row.date).toLocaleDateString() },
      { label: 'Meal Type', value: 'mealType' },
      { label: 'Foods', value: row => row.foods.map(f => f.name).join('; ') },
      { label: 'Calories', value: 'totalCalories' },
      { label: 'Protein (g)', value: 'totalProtein' },
      { label: 'Carbs (g)', value: 'totalCarbs' },
      { label: 'Fat (g)', value: 'totalFat' }
    ];

    const csv = generateCSV(entries.map(e => e.toObject()), fields);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=nutrition.csv');
    return res.send(csv);
  }

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=nutrition.pdf');
  
  doc.pipe(res);
  generateNutritionPDF(doc, entries, req.user);
  doc.end();
});

export const exportProgress = asyncHandler(async (req, res) => {
  const progress = await Progress.find({ user: req.user._id }).sort({ date: -1 });

  const fields = [
    { label: 'Date', value: row => new Date(row.date).toLocaleDateString() },
    { label: 'Weight (kg)', value: 'weight' },
    { label: 'Body Fat (%)', value: 'bodyFat' },
    { label: 'Chest (cm)', value: 'measurements.chest' },
    { label: 'Waist (cm)', value: 'measurements.waist' },
    { label: 'Bench Press (kg)', value: 'performance.benchPress' },
    { label: 'Pushups', value: 'performance.pushups' }
  ];

  const csv = generateCSV(progress.map(p => p.toObject()), fields);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=progress.csv');
  res.send(csv);
});