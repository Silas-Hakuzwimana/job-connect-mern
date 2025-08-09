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
  const response = await api.get(`/notifications?ts=${Date.now()}`);
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export const getNotificationsCount = async () => {
  const response = await api.get(
    `/notifications/unread-count?ts=${Date.now()}`,
  );
  return response.data.count;
};

export const hideNotification = async (id) => {
  const res = await api.post(`/notifications/${id}/hide`);
  return res.data;
};

export const unhideNotification = async (id) => {
  const res = await api.post(`/notifications/${id}/unhide`);
  return res.data;
};

export const fetchUnhiddenNotifications = async () => {
  const res = await api.get('/notifications/get-unhidden-notifications');
  return res.data;
};
