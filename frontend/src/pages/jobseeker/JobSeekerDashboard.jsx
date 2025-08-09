import { useEffect, useState } from "react";
import { getJobSeekerDashboard } from "../../services/jobseekerService";

const JobSeekerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await getJobSeekerDashboard();
        console.log("The retrieved data:", data);
        setDashboardData(data);
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

  // Defensive defaults and destructuring
  const user = dashboardData?.user || {};
  const stats = dashboardData?.stats || {};
  const applications = dashboardData?.recentApplications || [];
  const bookmarks = dashboardData?.bookmarks || [];
  const jobBookmarks = bookmarks.filter((b) => b.itemType === "job");

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Job Seeker Dashboard</h1>
      <p className="mb-6 text-gray-800 text-lg">
        Welcome to your dashboard,{" "}
        <span className="bg-cyan-700 font-semibold text-white px-2 py-1 rounded">
          {user.name?.split(" ")[0] || "User"}
        </span>
        !
        <br />
        Manage your profile, search for jobs, and track your applications.
      </p>

      {/* User Details Card */}
      <div className="bg-white rounded-lg p-6 shadow flex items-center mb-8 space-x-6">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt={`${user.name || "User"}'s avatar`}
            className="h-20 w-20 rounded-full object-cover border"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-semibold">
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold">{user.name || "User Name"}</h2>
          <p className="text-gray-600">{user.email || "user@jobconnect.com"}</p>
          <p className="text-gray-600">
            Role:{" "}
            <span className="bg-cyan-700 font-semibold text-white px-2 py-1 rounded">
              {user.role || "N/A"}
            </span>
          </p>
          <p className="text-gray-600">{user.location || "Location not set"}</p>
          <p className="mt-2 text-gray-700 italic">{user.bio || ""}</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Jobs Applied</h2>
          <p className="text-4xl font-bold">{stats.totalApplications || 0}</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Bookmarked Jobs</h2>
          <p className="text-4xl font-bold">{bookmarks.length || 0}</p>
        </div>
      </div>

      {/* Recent Applications */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
        {applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          <ul className="space-y-4">
            {applications.slice(0, 5).map((app) => (
              <li
                key={app._id}
                className="bg-white rounded-lg p-4 shadow flex justify-between"
              >
                <div>
                  <p className="font-semibold">{app.jobDetails?.title || "N/A"}</p>
                  <p className="text-sm text-gray-600">
                    Status: {app.status || "Pending"}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">Bookmarked Jobs</h3>
        {jobBookmarks.length === 0 ? (
          <p>No bookmarks yet.</p>
        ) : (
          <ul className="space-y-4">
            {jobBookmarks.slice(0, 5).map((bookmark) => {
              const job = bookmark.itemId || {};
              return (
                <li key={bookmark._id} className="bg-white rounded-lg p-4 shadow">
                  <h4 className="text-xl font-semibold">{job.title || "No Title"}</h4>
                  <p className="text-gray-600 font-medium">Company: {job.company || "No Company"}</p>
                  <p className="text-gray-500 text-sm mb-2">Location: {job.location || "No Location"}</p>
                  <p className="text-gray-700">Description: {job.description?.substring(0, 120) || "No description available."}</p>
                  <p className="mt-2 font-semibold text-cyan-700">
                    Salary: {job.salary ? `$${job.salary.toLocaleString()}` : "Not specified"}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default JobSeekerDashboard;
