import mongoose from 'mongoose';

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Strength', 'Cardio', 'Flexibility', 'HIIT', 'Yoga', 'Sports', 'Other'],
    required: true
  },
  exercises: [{
    name: { type: String, required: true },
    sets: { type: Number, min: 0 },
    reps: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
    duration: { type: Number, min: 0 }, // minutes
    distance: { type: Number, min: 0 }, // km
    notes: String
  }],
  duration: { type: Number, min: 0 }, // total in minutes
  caloriesBurned: { type: Number, min: 0 },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tags: [{ type: String }],
  notes: String,
  date: { type: Date, default: Date.now, index: true },
  completed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound indexes for fast queries
WorkoutSchema.index({ user: 1, date: -1 });
WorkoutSchema.index({ user: 1, category: 1 });
WorkoutSchema.index({ user: 1, name: 'text' });

export default mongoose.model('Workout', WorkoutSchema);