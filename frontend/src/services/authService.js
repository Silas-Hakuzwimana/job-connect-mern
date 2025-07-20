import api from "./api";

const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

const verifyOtp = async (data) => {
  // Make the API call to verify OTP
  const res = await api.post("/auth/verify-otp", data);
  return res.data;
};

const register = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export default {
  login,
  verifyOtp,
  register,
  logout,
  getCurrentUser,
  // Add any other auth-related methods here
};
