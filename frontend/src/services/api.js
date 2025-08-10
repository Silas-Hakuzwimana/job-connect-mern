// src/services/api.js
import axios from 'axios';

// Create an axios instance with base URL and cookie support
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // send cookies with requests
});

// Request interceptor to add Authorization header if token exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for global error handling (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      //handle 401 Unauthorized globally
      if (error.response.status === 401) {
        // clear token on auth failure
        localStorage.removeItem('token');
        //optionally redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
