import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { generateToken } from '../utils/jwt.util.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email already registered' 
    });
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please login.',
    data: { id: user._id, email: user.email }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const match = await comparePassword(password, user.password);
  if (!match) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        fitnessGoals: user.fitnessGoals,
        preferences: user.preferences,
        streak: user.streak
      },
      token
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { 
    fullName, age, gender, height, weight, 
    fitnessGoals, preferences, profilePicture 
  } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...(fullName && { fullName }),
      ...(age !== undefined && { age }),
      ...(gender && { gender }),
      ...(height !== undefined && { height }),
      ...(weight !== undefined && { weight }),
      ...(fitnessGoals && { fitnessGoals }),
      ...(preferences && { preferences }),
      ...(profilePicture && { profilePicture })
    },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Profile updated',
    data: user
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const match = await comparePassword(currentPassword, user.password);
  
  if (!match) {
    return res.status(401).json({ success: false, message: 'Current password incorrect' });
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  // Note: In production, also delete all related data (workouts, nutrition, etc.)
  res.json({ success: true, message: 'Account deleted' });
});