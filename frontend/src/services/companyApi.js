// src/services/companyApi.js
import api from './api';

// Get all companies
export const fetchCompanies = () => api.get('/companies');

// Search companies by query string (e.g., ?q=tech)
export const searchCompanies = (query) =>
  api.get('/companies/search', { params: { q: query } });

// Get company by ID
export const fetchCompany = (id) => api.get(`/companies/${id}`);

// Create new company (admin only)
export const createCompany = (data) => api.post('/companies', data);

// Update company by ID
export const updateCompany = (id, data) => api.put(`/companies/${id}`, data);

// Delete company by ID (admin only)
export const deleteCompany = (id) => api.delete(`/companies/${id}`);

// Get logged-in user's company profile
export const fetchMyCompanyProfile = () => api.get('/companies/profile/me');

// Update logged-in user's company profile
export const updateMyCompanyProfile = (data) =>
  api.put('/companies/profile/me', data);

// Get jobs posted by a specific company ID
export const fetchJobsByCompany = (companyId) =>
  api.get(`/companies/${companyId}/jobs`);

// Get applications for jobs posted by a specific company ID
export const fetchApplicationsForCompanyJobs = (companyId) =>
  api.get(`/companies/${companyId}/applications`);
