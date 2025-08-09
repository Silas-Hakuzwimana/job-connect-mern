const Notification = require('../models/Notification');
const { createNotification } = require('../services/notification.service');

//Create notification for the user

exports.createNotificationForUser = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    const notification = await createNotification(userId, message);

    res.status(201).json({ message: 'Notification created', notification });
  } catch (error) {
    console.error('Notification creation failed:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

// Get notifications for logged-in user, sorted by newest first
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // optional limit

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Failed to get notifications', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.getUnreadNotificationsCount = async (req, res) => {
  try {
    const userId = req.user._id; 

    const count = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });

    return res.json({ count });
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.user.id },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res
      .status(200)
      .json({ message: 'Notification marked as read', notification });
  } catch (err) {
    console.error('Failed to mark notification as read:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Create notification (for example usage)
exports.createNotification = async (
  userId,
  message,
  type = 'info',
  link = null,
) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type,
      link,
    });
    await notification.save();
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};
