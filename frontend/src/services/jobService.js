import api from './api';

export const fetchJobs = async () => {
  const res = await api.get('/jobs');
  return res.data;
};

export const fetchMatchedJobs = async () => {
  const res = await api.get('/jobs/matched');
  return res.data;
};

export const AddStatusToJob = async () => {
  const res = await api.get('/jobs');
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

// Generic Cloudinary uploader for any file
export const uploadFileToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload/application-files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data; // expects { url: "..." }
};

export const applyToJob = async ({
  jobId,
  resumeFile,
  coverLetter,
  qualifications,
}) => {
  // Upload resume file first
  const resumeUploadResponse = await uploadFileToCloudinary(resumeFile);
  const resumeUrl = resumeUploadResponse.url;

  let coverLetterUrl = null;

  if (coverLetter && coverLetter instanceof File) {
    // Cover letter is a file, upload it
    const coverLetterUploadResponse = await uploadFileToCloudinary(coverLetter);
    coverLetterUrl = coverLetterUploadResponse.url;
  }

  // Prepare payload with URLs and qualifications
  const payload = {
    resumeUrl,
    qualifications,
  };

  // If coverLetter is a string, send it directly; else send URL if uploaded
  if (typeof coverLetter === 'string') {
    payload.coverLetter = coverLetter;
  } else if (coverLetterUrl) {
    payload.coverLetterUrl = coverLetterUrl;
  }

  // Send JSON data to backend (no raw files here)
  const res = await api.post(`/applications/apply/${jobId}`, payload);

  return res.data;
};
