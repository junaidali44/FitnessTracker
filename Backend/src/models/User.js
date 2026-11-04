import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name too long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profilePicture: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1/default-avatar'
  },
  age: { type: Number, min: 10, max: 120 },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  height: { type: Number, min: 50, max: 250 }, // cm
  weight: { type: Number, min: 20, max: 400 }, // kg
  fitnessGoals: {
    type: String,
    enum: ['Weight Loss', 'Muscle Gain', 'Maintain', 'Endurance', 'General Fitness'],
    default: 'General Fitness'
  },
  preferences: {
    units: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    notifications: { type: Boolean, default: true },
    weeklyGoal: { type: Number, default: 5 } // workouts per week
  },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActivity: Date
  },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.index({ email: 1 });

export default mongoose.model('User', UserSchema);