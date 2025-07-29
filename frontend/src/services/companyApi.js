import api from './api';

export const fetchCompanies = () => api.get('/companies');
export const fetchCompany = (id) => api.get(`/companies/${id}`);
export const createCompany = (data, token) =>
  api.post('/companies/', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateCompany = (id, data, token) =>
  api.put(`/companies/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteCompany = (id, token) =>
  api.delete(`/companies/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
