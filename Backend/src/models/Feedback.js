import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Bug', 'Feature', 'Suggestion', 'Query'],
    required: true
  },
  subject: { type: String, required: true, maxlength: 200 },
  message: { type: String, required: true, maxlength: 2000 },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  adminResponse: String,
  createdAt: { type: Date, default: Date.now }
});

FeedbackSchema.index({ user: 1, createdAt: -1 });
FeedbackSchema.index({ status: 1 });

export default mongoose.model('Feedback', FeedbackSchema);