import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import Workout from './src/models/Workout.js';
import Nutrition from './src/models/Nutrition.js';
import Progress from './src/models/Progress.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected');

    // Clear existing
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Nutrition.deleteMany({});
    await Progress.deleteMany({});

    // Create test user
    const hashedPassword = await bcrypt.hash('Test@123', 10);
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@fitness.com',
      password: hashedPassword,
      age: 25,
      gender: 'Male',
      height: 175,
      weight: 70,
      fitnessGoals: 'Muscle Gain'
    });
    console.log('✅ User created: test@fitness.com / Test@123');

    // Sample workouts
    const workouts = [
      { name: 'Push Day', category: 'Strength', duration: 45, caloriesBurned: 350, exercises: [{ name: 'Bench Press', sets: 4, reps: 8, weight: 60 }] },
      { name: 'Morning Run', category: 'Cardio', duration: 30, caloriesBurned: 300, exercises: [] },
      { name: 'HIIT Session', category: 'HIIT', duration: 20, caloriesBurned: 250, exercises: [] },
      { name: 'Yoga Flow', category: 'Yoga', duration: 40, caloriesBurned: 150, exercises: [] }
    ].map(w => ({ ...w, user: user._id, date: new Date() }));

    await Workout.insertMany(workouts);
    console.log(`✅ ${workouts.length} workouts seeded`);

    // Sample nutrition
    const nutrition = [
      { mealType: 'Breakfast', foods: [{ name: 'Oats', quantity: 80, calories: 300, protein: 10, carbs: 54, fat: 6 }], totalCalories: 300, totalProtein: 10, totalCarbs: 54, totalFat: 6 },
      { mealType: 'Lunch', foods: [{ name: 'Chicken Rice', quantity: 1, calories: 600, protein: 40, carbs: 60, fat: 15 }], totalCalories: 600, totalProtein: 40, totalCarbs: 60, totalFat: 15 }
    ].map(n => ({ ...n, user: user._id, date: new Date() }));

    await Nutrition.insertMany(nutrition);
    console.log(`✅ ${nutrition.length} nutrition entries seeded`);

    // Sample progress
    await Progress.create({
      user: user._id,
      weight: 70,
      bodyFat: 18,
      measurements: { chest: 95, waist: 80, arms: 32 },
      performance: { benchPress: 60, pushups: 30, pullups: 8 }
    });
    console.log('✅ Progress entry seeded');

    console.log('\n🎉 Seeding complete!');
    console.log('Login: test@fitness.com / Test@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();