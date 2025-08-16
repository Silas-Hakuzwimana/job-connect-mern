import api from './api';

// --- Companies ---
export const fetchCompanies = async () => {
  try {
    const res = await api.get('/company');
    return res.data;
  } catch (err) {
    console.error('Failed to fetch companies:', err);
    throw err;
  }
};

export const searchCompanies = async (query) => {
  try {
    const res = await api.get('/company/search', { params: { q: query } });
    return res.data;
  } catch (err) {
    console.error('Company search failed:', err);
    throw err;
  }
};

export const fetchCompany = async (id) => {
  try {
    const res = await api.get(`/company/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch company ${id}:`, err);
    throw err;
  }
};

export const createCompany = async (data) => {
  try {
    const res = await api.post('/company', data);
    return res.data;
  } catch (err) {
    console.error('Failed to create company:', err);
    throw err;
  }
};

export const updateCompany = async (id, data) => {
  try {
    const res = await api.put(`/company/${id}`, data);
    return res.data;
  } catch (err) {
    console.error(`Failed to update company ${id}:`, err);
    throw err;
  }
};

export const deleteCompany = async (id) => {
  try {
    const res = await api.delete(`/company/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to delete company ${id}:`, err);
    throw err;
  }
};

// --- My company profile ---
export const fetchMyCompanyProfile = async () => {
  try {
    const res = await api.get('/company/profile/me');
    console.log('fetchMyCompanyProfile response:', res.data);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch my company profile:', err);
    throw err;
  }
};

export const updateMyCompanyProfile = async (data) => {
  try {
    const res = await api.put('/company/profile/me', data);
    return res.data;
  } catch (err) {
    console.error('Failed to update my company profile:', err);
    throw err;
  }
};

// --- Jobs ---
export const fetchJobsByCompany = async (companyId) => {
  if (!companyId) {
    throw new Error('Cannot fetch jobs: companyId is undefined');
  }
  const res = await api.get(`/company/${companyId}/jobs`);
  return res.data;
};

export const fetchAllDashboardJobs = async () => {
  try {
    const res = await api.get(`/company/dashboard/jobs?ts=${Date.now()}`);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch dashboard jobs:', err);
    throw err;
  }
};

// --- Applications ---
export const fetchApplicationsForCompanyJobs = async (companyId) => {
  try {
    const res = await api.get(`/company/${companyId}/applications`);
    return res.data;
  } catch (err) {
    console.error(
      `Failed to fetch applications for company ${companyId}:`,
      err,
    );
    throw err;
  }
};

// --- Dashboard stats & notifications ---
export const fetchCompanyStats = async () => {
  try {
    const res = await api.get(`/company/dashboard/stats?ts=${Date.now()}`);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch company stats:', err);
    throw err;
  }
};

export const fetchCompanyNotifications = async () => {
  try {
    const res = await api.get(`/company/notifications?ts=${Date.now()}`);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch company notifications:', err);
    throw err;
  }
};
