import api from './api';

export const createNotification = async (userId, message) => {
  try {
    const response = await api.post('/notifications/create', {
      userId,
      message,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
};

export const fetchNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};
