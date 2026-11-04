import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const { unreadOnly, page = 1, limit = 20 } = req.query;

  const filter = { user: req.user._id };
  if (unreadOnly === 'true') filter.read = false;

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({ 
    user: req.user._id, 
    read: false 
  });

  res.json({
    success: true,
    data: notifications,
    unreadCount,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  res.json({ success: true, data: notification });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { read: true }
  );

  res.json({ success: true, message: 'All notifications marked as read' });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  res.json({ success: true, message: 'Notification deleted' });
});