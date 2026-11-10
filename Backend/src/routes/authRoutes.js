import express from 'express';
import {
  register, login, getMe, updateProfile, changePassword, deleteAccount,
  forgotPassword, resetPassword,
  uploadAvatar
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;