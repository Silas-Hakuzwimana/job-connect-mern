import React, { useEffect, useState } from 'react';
import { fetchJobs, approveJob, rejectJob, deleteJob } from '../../services/adminApis';

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs().then(res => setJobs(res.data));
  }, []);

  const handleApprove = async (id) => {
    await approveJob(id);
    const updated = await fetchJobs();
    setJobs(updated.data);
  };

  const handleReject = async (id) => {
    await rejectJob(id);
    const updated = await fetchJobs();
    setJobs(updated.data);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this job?")) {
      await deleteJob(id);
      const updated = await fetchJobs();
      setJobs(updated.data);
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Job Listings</h2>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th>Title</th><th>Company</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.companyName}</td>
              <td>{job.status}</td>
              <td className="space-x-2">
                {job.status !== 'approved' && (
                  <button onClick={() => handleApprove(job._id)} className="text-green-600">Approve</button>
                )}
                {job.status !== 'rejected' && (
                  <button onClick={() => handleReject(job._id)} className="text-yellow-600">Reject</button>
                )}
                <button onClick={() => handleDelete(job._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
