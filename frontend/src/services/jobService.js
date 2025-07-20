import api from "./api";

export const fetchJobs = async () => {
  const res = await api.get("/jobs");
  return res.data;
};

export const postJob = async (jobData) => {
  const res = await api.post("/jobs", jobData);
  return res.data;
};

export const getJobById = async (jobId) => {
  const res = await api.get(`/jobs/${jobId}`);
  return res.data;
};
