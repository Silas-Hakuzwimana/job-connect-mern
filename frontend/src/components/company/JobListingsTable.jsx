import { useEffect, useState } from "react";
import { Pencil, Trash2, Eye, X } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import { fetchJobsByCompany, fetchMyCompanyProfile } from "../../services/companyApi";
import { deleteJob, updateJob } from "../../services/jobService";

const JobListingsTable = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewJob, setViewJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [saving, setSaving] = useState(false);

  // Calculate countdown string
  const getCountdown = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const fetchJobs = async () => {
    try {
      const companyProfile = await fetchMyCompanyProfile();
      if (!companyProfile?._id) {
        console.error("No company profile found");
        setLoading(false);
        return;
      }

      const res = await fetchJobsByCompany(companyProfile._id);
      let jobsList = res?.jobs || [];

      jobsList = jobsList.map((job) => ({
        ...job,
        isActive: new Date(job.deadline) > new Date(),
        countdown: getCountdown(job.deadline),
      }));

      setJobs(jobsList);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((prev) =>
        prev.map((job) => ({
          ...job,
          isActive: new Date(job.deadline) > new Date(),
          countdown: getCountdown(job.deadline),
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(id);
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job. Please try again.");
    }
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const updated = await updateJob(editJob._id, editJob);
      setJobs(jobs.map((job) => (job._id === updated._id ? updated : job)));
      setEditJob(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Applicants</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr key={job._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{job.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${job.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                    >
                      {job.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{job.applicants_count || 0}</td>
                  <td className="px-4 py-3">{job.countdown}</td>
                  <td className="px-4 py-3 flex justify-end gap-2">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="View"
                      onClick={() => setViewJob(job)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                      title="Edit"
                      onClick={() => setEditJob(job)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No job listings found. Post one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewJob && (
        <Modal title="View Job" onClose={() => setViewJob(null)}>
          <JobDetails job={viewJob} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editJob && (
        <Modal title="Edit Job" onClose={() => setEditJob(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditSave();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={editJob.title}
                onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="text"
                value={new Date(editJob.deadline).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
                onChange={(e) => setEditJob({ ...editJob, deadline: new Date(e.target.value) })}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setEditJob(null)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

// Reusable Modal
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
      >
        <X size={20} />
      </button>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  </div>
);

// Simple JobDetails display
const JobDetails = ({ job }) => (
  <div className="space-y-2 text-sm text-gray-700">
    <p>
      <span className="font-medium">Title: </span>
      {job.title}
    </p>
    <p>
      <span className="font-medium">Deadline: </span>
      {new Date(job.deadline).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })}
    </p>
    <p>
      <span className="font-medium">Applicants: </span>
      {job.applicants_count || 0}
    </p>
    <p>
      <span className="font-medium">Status: </span>
      {job.isActive ? "Active" : "Inactive"}
    </p>
  </div>
);

export default JobListingsTable;
