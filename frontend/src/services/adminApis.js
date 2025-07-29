import api from './api';
import axios from 'axios';


// USERS
export const fetchUsers = async () => {
  const token = localStorage.getItem("token"); 
  return await axios.get("/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
    withCredentials: true, 
  });
};

export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// JOBS
export const fetchJobs = () => api.get('/admin/jobs');
export const deleteJob = (id) => api.delete(`/admin/jobs/${id}`);


//Not yet implemented in the original code

export const approveJob = (id) => api.post(`/admin/jobs/${id}/approve`);
export const rejectJob = (id) => api.post(`/admin/jobs/${id}/reject`);

// export const getAdminStats = () => api.get('/admin/dashboard-stats');

/* to here*/

export const getAdminStats = () =>
  api.get("/admin/dashboard-stats");


// APPLICATIONS
export const fetchApplications = () => api.get('/admin/applications');

// QUALIFICATIONS
export const fetchQualifications = () => api.get('/admin/qualifications');
export const deleteQualification = (id) => api.delete(`/admin/qualifications/${id}`);
