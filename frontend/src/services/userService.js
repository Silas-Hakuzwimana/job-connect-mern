import api from "./api";

export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const getUserById = async (userId) => {
    const res = await api.get(`/users/${userId}`);
    return res.data;
};

export const updateUser = async (userId, userData) => {
  const res = await api.put(`/users/${userId}`, userData);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
};

export const updateUserRole = async (userId, role) => {
  const res = await api.patch(`/users/${userId}`, { role });
  return res.data;
};
