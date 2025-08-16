import { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import { fetchJobsByCompany } from "../../services/companyApi";
import { deleteJob } from "../../services/jobService";

const JobListingsTable = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await fetchJobsByCompany();
      setJobs(res.data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await deleteJob();
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Applicants</th>
            <th className="px-4 py-3">Posted On</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <tr
                key={job.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-medium">{job.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3">{job.applicants_count || 0}</td>
                <td className="px-4 py-3">
                  {new Date(job.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 flex justify-end gap-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
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
              <td
                colSpan="5"
                className="px-4 py-6 text-center text-gray-500"
              >
                No job listings found. Post one to get started!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobListingsTable;
