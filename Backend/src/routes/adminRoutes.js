import express from 'express';
import {
  getAdminDashboard,
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllFeedback,
  respondToFeedback,
  deleteFeedback,
  getSystemAnalytics
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require auth + Admin role
router.use(protect);
router.use(authorize('Admin'));

// Dashboard
router.get('/dashboard', getAdminDashboard);
router.get('/analytics', getSystemAnalytics);

// Users
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Feedback
router.get('/feedback', getAllFeedback);
router.put('/feedback/:id/respond', respondToFeedback);
router.delete('/feedback/:id', deleteFeedback);

export default router;