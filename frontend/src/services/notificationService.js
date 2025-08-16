import api from './api';

// --- Create a notification ---
export const createNotification = async (
  userId,
  message,
  type = 'info',
  link = '',
) => {
  try {
    const res = await api.post('/notifications/create', {
      userId,
      message,
      type,
      link,
    });
    return res.data;
  } catch (err) {
    console.error('Failed to create notification:', err);
    throw err;
  }
};

// --- Fetch notifications ---
export const fetchNotifications = async () => {
  try {
    const res = await api.get(`/notifications?ts=${Date.now()}`);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
    throw err;
  }
};

// --- Fetch only unhidden notifications ---
export const fetchUnhiddenNotifications = async () => {
  try {
    const res = await api.get(
      `/notifications/get-unhidden-notifications?ts=${Date.now()}`,
    );
    return res.data;
  } catch (err) {
    console.error('Failed to fetch unhidden notifications:', err);
    throw err;
  }
};

// --- Mark as read ---
export const markNotificationAsRead = async (notificationId) => {
  try {
    const res = await api.patch(`/notifications/${notificationId}/read`);
    return res.data;
  } catch (err) {
    console.error(
      `Failed to mark notification ${notificationId} as read:`,
      err,
    );
    throw err;
  }
};

// --- Get unread count ---
export const getNotificationsCount = async () => {
  try {
    const res = await api.get(`/notifications/unread-count?ts=${Date.now()}`);
    return res.data.count;
  } catch (err) {
    console.error('Failed to fetch notifications count:', err);
    throw err;
  }
};

// --- Hide / Unhide notifications ---
export const hideNotification = async (id) => {
  try {
    const res = await api.post(`/notifications/${id}/hide`);
    return res.data;
  } catch (err) {
    console.error(`Failed to hide notification ${id}:`, err);
    throw err;
  }
};

export const unhideNotification = async (id) => {
  try {
    const res = await api.post(`/notifications/${id}/unhide`);
    return res.data;
  } catch (err) {
    console.error(`Failed to unhide notification ${id}:`, err);
    throw err;
  }
};
