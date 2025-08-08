import api from './api';

export const fetchJobs = async () => {
  const res = await api.get('/jobs');
  return res.data;
};

//Fetch matched jobs
export const fetchMtached = async () => {
  const res = await api.get('/jobs/matched');
  return res.data;
};

export const postJob = async (jobData) => {
  const res = await api.post('/jobs', jobData);
  return res.data;
};

export const getJobById = async (jobId) => {
  const res = await api.get(`/jobs/${jobId}`);
  return res.data;
};

export const updateJob = async (jobId, jobData) => {
  const res = await api.put(`/jobs/${jobId}`, jobData);
  return res.data;
};

export const deleteJob = async (jobId) => {
  const res = await api.delete(`/jobs/${jobId}`);
  return res.data;
};
