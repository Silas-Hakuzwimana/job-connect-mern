import api from './api';

export const getBookmarks = async () => {
  const res = await api.get("/bookmarks");
  return res.data;  // return just data
};

export const addBookmark = async (data) => {
  const res = await api.post("/bookmarks", data);
  return res.data;
};

export const deleteBookmark = async (id) => {
  const res = await api.delete(`/bookmarks/${id}`);
  return res.data;
};
