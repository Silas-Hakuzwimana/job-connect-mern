const Notification = require('../models/Notification');

async function createNotification(userId, message) {
  if (!userId || !message) {
    throw new Error('userId and message are required');
  }

  const notification = new Notification({
    user: userId,
    message,
  });

  return await notification.save();
}

module.exports = { createNotification };
