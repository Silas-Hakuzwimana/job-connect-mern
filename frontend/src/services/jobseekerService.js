import api from './api';

export const getJobSeekerDashboard = async () => {
  try {
    const response = await api.get('/jobseeker/dashboard', {
      withCredentials: true,
    });
    return response.data; // this returns the actual JSON object
  } catch (error) {
    console.error('Error fetching job seeker dashboard:', error);
    throw error;
  }
};

export const getJobseekerProfile = () => api.get('/jobseeker/profile');
export const updateJobseekerProfile = (data) => api.put('/jobseeker/profile', data);
