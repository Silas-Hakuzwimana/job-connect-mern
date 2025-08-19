import { useEffect, useState, useContext } from "react";
import { X, Eye } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import { fetchApplicationsForCompanyJobs, fetchMyCompanyProfile } from "../../services/companyApi";
import { AuthContext } from "../../context/AuthContext";

const Applications = () => {
  const { user } = useContext(AuthContext);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewApp, setViewApp] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // applicants per page

  useEffect(() => {
    let isMounted = true;

    const loadApplications = async () => {
      try {
        setLoading(true);
        const companyProfile = await fetchMyCompanyProfile();
        if (!companyProfile?._id) {
          console.error("No company profile found.");
          return;
        }

        const res = await fetchApplicationsForCompanyJobs(companyProfile._id);
        if (isMounted) setApplicants(res || []);
      } catch (err) {
        console.error("Failed to fetch applicants:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadApplications();
    return () => { isMounted = false; };
  }, [user?._id]);

  const filteredApplicants = applicants
    .filter(app => (filter === "all" ? true : app.status === filter))
    .filter(app =>
      app.applicantDetails?.name.toLowerCase().includes(search.toLowerCase()) ||
      app.applicantDetails?.email.toLowerCase().includes(search.toLowerCase()) ||
      app.jobDetails?.title.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(filteredApplicants.length / pageSize);
  const paginatedApplicants = filteredApplicants.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Applications</h2>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name, email or job..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2 mt-2 sm:mt-0">
          {["all", "pending", "interviewed", "rejected", "hired"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded text-sm ${filter === status ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {paginatedApplicants.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Job Applied</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Applied At</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApplicants.map((app) => (
                <tr
                  key={app._id}
                  className={`hover:bg-gray-50 transition ${new Date(app.jobDetails.deadline) < new Date() ? "bg-red-50" : ""
                    }`}
                >
                  <td className="px-4 py-2 border-b">{app.applicantDetails?.name}</td>
                  <td className="px-4 py-2 border-b">{app.applicantDetails?.email}</td>
                  <td className="px-4 py-2 border-b">{app.jobDetails?.title}</td>
                  <td className="px-4 py-2 border-b capitalize">{app.status}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(app.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2 border-b flex justify-center gap-2">
                    <button
                      onClick={() => setViewApp(app)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Eye size={16} /> View
                    </button>
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Resume
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* View Modal */}
      {viewApp && (
        <Modal title="Applicant Details" onClose={() => setViewApp(null)}>
          <ApplicantDetails app={viewApp} />
        </Modal>
      )}
    </div>
  );
};

// Reusable Modal
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
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

// Applicant Details Component
const ApplicantDetails = ({ app }) => (
  <div className="space-y-2 text-gray-700 text-sm">
    <div className="flex items-center gap-4">
      {app.applicantDetails?.profilePic && (
        <img
          src={app.applicantDetails.profilePic}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
      )}
      <div>
        <p className="font-semibold">{app.applicantDetails?.name}</p>
        <p>{app.applicantDetails?.email}</p>
        <p>{app.applicantDetails?.phone || "-"}</p>
        <p>{app.applicantDetails?.location || "-"}</p>
      </div>
    </div>
    <p className="mt-2">
      <span className="font-medium">Bio: </span>
      {app.applicantDetails?.bio || "No bio provided"}
    </p>
    <p>
      <span className="font-medium">Job Applied: </span>
      {app.jobDetails?.title}
    </p>
    <p>
      <span className="font-medium">Job Location: </span>
      {app.jobDetails?.location}
    </p>
    <p>
      <span className="font-medium">Status: </span>
      {app.status}
    </p>
    {app.coverLetter && (
      <p>
        <span className="font-medium">Cover Letter: </span>
        {app.coverLetter}
      </p>
    )}
    {app.resumeUrl && (
      <a
        href={app.resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
      >
        View Resume
      </a>
    )}
  </div>
);

export default Applications;
