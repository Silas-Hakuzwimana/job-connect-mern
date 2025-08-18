import { useEffect, useState, useContext } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { fetchApplicationsForCompanyJobs } from "../../services/companyApi";
import { AuthContext } from "../../context/AuthContext";

const ApplicantsList = () => {
  const { user } = useContext(AuthContext);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.companyId) return; // only run if companyId exists

    let isMounted = true;

    const loadApplicants = async () => {
      try {
        setLoading(true);
        const res = await fetchApplicationsForCompanyJobs(user.companyId);
        console.log("Applicants fetched: ", res);
        if (isMounted) {
          setApplicants(res.applications || []);
        }
      } catch (err) {
        console.error("Failed to fetch applicants:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadApplicants();

    return () => {
      isMounted = false; // cleanup to avoid state updates after unmount
    };
  }, [user?.companyId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Applicants</h2>
      {applicants.length === 0 ? (
        <p className="text-gray-500">No applicants found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left border-b">Name</th>
                <th className="px-4 py-2 text-left border-b">Email</th>
                <th className="px-4 py-2 text-left border-b">Job Applied</th>
                <th className="px-4 py-2 text-left border-b">Status</th>
                <th className="px-4 py-2 text-left border-b">Applied At</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{app.applicant.name}</td>
                  <td className="px-4 py-2 border-b">{app.applicant.email}</td>
                  <td className="px-4 py-2 border-b">{app.job.title}</td>
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

export default ApplicantsList;
