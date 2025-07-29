import api from './api'; 

export const getBookmarks = () => api.get("/bookmarks");
export const addBookmark = (data) => api.post("/bookmarks", data);
export const deleteBookmark = (id) => api.delete(`/bookmarks/${id}`);