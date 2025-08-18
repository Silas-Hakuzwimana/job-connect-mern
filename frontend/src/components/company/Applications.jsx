import { useEffect, useState, useContext } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { fetchApplicationsForCompanyJobs } from "../../services/companyApi";
import { AuthContext } from "../../context/AuthContext";

const Applications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.companyId) return; // wait until companyId is available

    let isMounted = true;

    const loadApplications = async () => {
      try {
        setLoading(false);
        const res = await fetchApplicationsForCompanyJobs(user.companyId);
        if (isMounted) {
          setApplications(res.applications || []);
        }
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadApplications();

    // 🔄 Auto-refresh every 60s (optional)
    const interval = setInterval(loadApplications, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user?.companyId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Applications</h2>
      {applications.length === 0 ? (
        <p className="text-gray-500">No applications submitted yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border-b text-left">Job Title</th>
                <th className="px-4 py-2 border-b text-left">Applicant</th>
                <th className="px-4 py-2 border-b text-left">Email</th>
                <th className="px-4 py-2 border-b text-left">Status</th>
                <th className="px-4 py-2 border-b text-left">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{app.job.title}</td>
                  <td className="px-4 py-2 border-b">{app.applicant.name}</td>
                  <td className="px-4 py-2 border-b">{app.applicant.email}</td>
                  <td className="px-4 py-2 border-b">{app.status}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(app.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applications;
