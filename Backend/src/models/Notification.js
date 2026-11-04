import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['Workout', 'Goal', 'Reminder', 'System'],
    required: true
  },
  title: { type: String, required: true },
  message: String,
  read: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now }
});

NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export default mongoose.model('Notification', NotificationSchema);