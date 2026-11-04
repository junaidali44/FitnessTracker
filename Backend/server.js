import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { startCronJobs } from './src/services/cronService.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Start cron jobs
    startCronJobs();

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
       console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

    process.on('unhandledRejection', (err) => {
      console.error('💥 Unhandled Rejection:', err.message);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();