import crypto from "crypto";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "../services/emailService.js";
import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import { generateToken } from "../utils/jwt.util.js";
import { asyncHandler } from "../middleware/errorHandler.js";

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

  // Send welcome email (async, don't block response)
  sendWelcomeEmail(user).catch(err => 
    console.error('Welcome email failed:', err.message)
  );

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please login.',
    data: { id: user._id, email: user.email }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const match = await comparePassword(password, user.password);
  if (!match) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        fitnessGoals: user.fitnessGoals,
        preferences: user.preferences,
        streak: user.streak,
      },
      token,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const {
    fullName,
    age,
    gender,
    height,
    weight,
    fitnessGoals,
    preferences,
    profilePicture,
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
      ...(profilePicture && { profilePicture }),
    },
    { new: true, runValidators: true },
  ).select("-password");

  res.json({
    success: true,
    message: "Profile updated",
    data: user,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  const match = await comparePassword(currentPassword, user.password);

  if (!match) {
    return res
      .status(401)
      .json({ success: false, message: "Current password incorrect" });
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  res.json({ success: true, message: "Password changed successfully" });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  // Note: In production, also delete all related data (workouts, nutrition, etc.)
  res.json({ success: true, message: "Account deleted" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Security
    return res.json({
      success: true,
      message: 'If that email exists, a reset link has been sent.'
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save({ validateBeforeSave: false });

  // Send email
  const sent = await sendPasswordResetEmail(user, resetToken);
  if (!sent) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send reset email. Try again.' 
    });
  }

  res.json({
    success: true,
    message: 'If that email exists, a reset link has been sent.'
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ 
      success: false, 
      message: 'Token and new password required' 
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 6 characters' 
    });
  }

  // Hash the incoming token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid or expired reset token' 
    });
  }

  // Update password
  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful. You can now login.'
  });
});

// Profile Picture Upload 
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: req.file.path },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: 'Profile picture updated',
      data: user 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Upload failed' 
    });
  }
}