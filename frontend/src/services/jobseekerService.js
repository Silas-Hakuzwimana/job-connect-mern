import api from './api';

export const getJobSeekerDashboard = async () => {
  try {
    const response = await api.get('/jobseeker/dashboard', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching job seeker dashboard:', error);
    throw error;
  }
};
