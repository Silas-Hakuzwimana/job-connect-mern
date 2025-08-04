import api from './api'; // Axios instance with baseURL set

// Upload profile image
export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Get profile
export const getProfile = () => api.get('/jobseeker/profile');

// Update profile
export const updateProfile = (data) => api.put('/jobseeker/profile', data);
