import express from 'express';
import {
  register, login, getMe, updateProfile, changePassword, deleteAccount
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);
router.post('/upload-avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: req.file.path },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;