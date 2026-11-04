import mongoose from 'mongoose';

const NutritionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Pre-Workout', 'Post-Workout'],
    required: true
  },
  foods: [{
    name: { type: String, required: true },
    quantity: { type: Number, min: 0 },
    unit: { type: String, default: 'g' },
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 }
  }],
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 },
  date: { type: Date, default: Date.now, index: true },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

NutritionSchema.index({ user: 1, date: -1 });
NutritionSchema.index({ user: 1, mealType: 1 });

export default mongoose.model('Nutrition', NutritionSchema);