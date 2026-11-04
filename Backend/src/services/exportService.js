import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

export const generateCSV = (data, fields) => {
  const parser = new Parser({ fields });
  return parser.parse(data);
};

export const generateWorkoutsPDF = (doc, workouts, user) => {
  doc.fontSize(20).text('Workout Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`User: ${user.fullName}`);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`);
  doc.text(`Total Workouts: ${workouts.length}`);
  doc.moveDown();

  workouts.forEach((w, i) => {
    doc.fontSize(14).text(`${i + 1}. ${w.name}`, { underline: true });
    doc.fontSize(10).text(`   Category: ${w.category}`);
    doc.text(`   Date: ${new Date(w.date).toLocaleDateString()}`);
    doc.text(`   Duration: ${w.duration} min | Calories: ${w.caloriesBurned}`);
    doc.text(`   Exercises: ${w.exercises.map(e => e.name).join(', ')}`);
    doc.moveDown(0.5);
  });
};

export const generateNutritionPDF = (doc, entries, user) => {
  doc.fontSize(20).text('Nutrition Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`User: ${user.fullName}`);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`);
  doc.moveDown();

  const totals = entries.reduce((acc, e) => ({
    calories: acc.calories + e.totalCalories,
    protein: acc.protein + e.totalProtein,
    carbs: acc.carbs + e.totalCarbs,
    fat: acc.fat + e.totalFat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  doc.fontSize(14).text('Summary:', { underline: true });
  doc.fontSize(11);
  doc.text(`Total Calories: ${totals.calories}`);
  doc.text(`Total Protein: ${totals.protein}g`);
  doc.text(`Total Carbs: ${totals.carbs}g`);
  doc.text(`Total Fat: ${totals.fat}g`);
  doc.moveDown();

  entries.forEach((e, i) => {
    doc.fontSize(12).text(`${i + 1}. ${e.mealType} - ${new Date(e.date).toLocaleDateString()}`);
    doc.fontSize(10).text(`   Foods: ${e.foods.map(f => f.name).join(', ')}`);
    doc.text(`   Calories: ${e.totalCalories} | Protein: ${e.totalProtein}g`);
    doc.moveDown(0.5);
  });
};