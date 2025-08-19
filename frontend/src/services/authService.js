import api from './api';

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const verifyOtp = async (data) => {
  const res = await api.post('/auth/verify-otp', data);
  return res.data;
};

export const register = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const forgotPassword = async (data) => {
  const res = await api.post('/auth/forgot-password', data);
  return res.data;
};

export const resetPassword = async ({ email, token, password }) => {
  if (!email || !token || !password) {
    throw new Error('Email, token, and password are required');
  }
  const res = await api.post(`/auth/reset-password/${token}`, { token, password });
  return res.data;
};

export const logout = async () => {
  // plain API call only
  return await api.post('/auth/logout');
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data.user;
};

export default {
  login,
  verifyOtp,
  register,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
