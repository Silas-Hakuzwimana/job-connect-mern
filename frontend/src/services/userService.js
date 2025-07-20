import api from "./api";

export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const updateUserRole = async (userId, role) => {
  const res = await api.patch(`/users/${userId}`, { role });
  return res.data;
};
