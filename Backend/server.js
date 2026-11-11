import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { startCronJobs } from './src/services/cronService.js';
import { verifyEmailService } from './src/services/emailService.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await verifyEmailService();  // ← Add this line
    startCronJobs();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
    });

    process.on('SIGTERM', () => {
      server.close(() => process.exit(0));
    });

    process.on('unhandledRejection', (err) => {
      console.error('💥 Unhandled Rejection:', err.message);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error('❌ Failed to start:', error);
    process.exit(1);
  }
};

startServer();