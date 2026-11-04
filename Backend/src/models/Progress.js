import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  weight: { type: Number, min: 20, max: 400 },
  bodyFat: { type: Number, min: 0, max: 70 },
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    arms: Number,
    thighs: Number
  },
  performance: {
    runTime: Number,     // 5K in minutes
    pushups: Number,
    pullups: Number,
    squats: Number,
    benchPress: Number,
    deadlift: Number
  },
  notes: String,
  date: { type: Date, default: Date.now, index: true },
  createdAt: { type: Date, default: Date.now }
});

ProgressSchema.index({ user: 1, date: -1 });

export default mongoose.model('Progress', ProgressSchema);