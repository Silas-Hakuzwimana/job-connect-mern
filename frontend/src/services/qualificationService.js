import api from './api';

// GET all qualifications
export const fetchAllQualifications = async () => {
  const res = await api.get('/qualifications');
  return res.data;
};

export const fetchUserQualifications = async () => {
  const res = await api.get('qualifications/me');
  return res.data.qualifications; 
};

// GET a qualification by ID
export const getQualificationById = async (id) => {
  const res = await api.get(`/qualifications/${id}`);
  return res.data;
};

// CREATE a new qualification
export const createQualification = async (data) => {
  const res = await api.post('/qualifications', data);
  return res.data;
};

// UPDATE an existing qualification
export const updateQualification = async (id, data) => {
  const res = await api.put(`/qualifications/${id}`, data);
  return res.data;
};

// DELETE a qualification
export const deleteQualification = async (id) => {
  const res = await api.delete(`/qualifications/${id}`);
  return res.data;
};

// Save qualifications for the current user
export const saveUserQualifications = async (qualifications) => {
  const res = await api.post('/qualifications/save', { qualifications });
  return res.data;
};
