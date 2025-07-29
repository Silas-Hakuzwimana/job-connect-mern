import api from './api';

const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

const verifyOtp = async (data) => {
  // Make the API call to verify OTP
  const res = await api.post('/auth/verify-otp', data);
  return res.data;
};

const register = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

const forgotPassword = async (data) => {
  const res = await api.post('/auth/forgot-password', data);
  return res.data;
};

const resetPassword = async ({ email, token, password }) => {
  // Validate input
  if (!email || !token || !password) {
    throw new Error('Email, token, and password are required');
  }
  // Make the API call to reset password
  const res = await api.post(`/auth/reset-password/${token}`, {
    token,
    password,
  });
  return res.data;
};

const logout = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export default {
  login,
  verifyOtp,
  register,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  // Add any other auth-related methods here
};
