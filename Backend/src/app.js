import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import nutritionRoutes from './routes/nutritionRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import adminRoutes from './routes/adminRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
const app = express();


// Security & Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests, please try again later'
});
app.use('/api', limiter);

// Auth rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many auth attempts, please try again later'
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Fitness Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler 
app.use(errorHandler);

export default app;