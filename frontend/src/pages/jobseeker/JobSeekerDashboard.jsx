import { useEffect, useState } from "react";
import { getJobSeekerDashboard } from "../../services/jobseekerService";

const JobSeekerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await getJobSeekerDashboard();
        setDashboardData(response.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-6">Loading your dashboard...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Job Seeker Dashboard</h1>
      <p className="mb-6">
        Welcome to your dashboard! Manage your profile, search for jobs, and
        track your applications.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Jobs Applied</h2>
          <p className="text-4xl font-bold">
            {dashboardData.stats.jobsApplied || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Bookmarked Jobs</h2>
          <p className="text-4xl font-bold">
            {dashboardData.stats.bookmarkedJobs || 0}
          </p>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
        {dashboardData.applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          <ul className="space-y-4">
            {dashboardData.applications.slice(0, 5).map((app) => (
              <li
                key={app._id}
                className="bg-white rounded-lg p-4 shadow flex justify-between"
              >
                <div>
                  <p className="font-semibold">{app.jobId?.title || "N/A"}</p>
                  <p className="text-sm text-gray-600">
                    Status: {app.status || "Pending"}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">Bookmarked Jobs</h3>
        {dashboardData.bookmarks.filter(b => b.itemType === 'job').length === 0 ? (
          <p>No bookmarks yet.</p>
        ) : (
          <ul className="space-y-4">
            {dashboardData.bookmarks
              .filter((b) => b.itemType === "job")
              .slice(0, 5)
              .map((bookmark) => (
                <li
                  key={bookmark._id}
                  className="bg-white rounded-lg p-4 shadow"
                >
                  {bookmark.itemId?.title || "Job details not available"}
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default JobSeekerDashboard;
