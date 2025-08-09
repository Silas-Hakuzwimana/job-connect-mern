import api from './api';

export const getUserApplications = async () => {
  try {
    const response = await api.get('/applications/my');
    return response.data;
  } catch (error) {
    console.error('Error fetching applications: ', error);
    throw error;
  }
};

export const flagApplication = async (jobIds) => {
  try {
    const response = await api.post('/applications/flag-application', {jobIds});
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs with applied flag:', error);
    throw error;
  }
};
