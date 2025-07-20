import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingCompanies: 0,
    pendingJobs: 0,
    totalApplications: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/dashboard-stats", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          console.error("Failed to load stats");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-8">Welcome back, <span className="font-semibold">{user?.name}</span></p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-blue-600 text-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-3xl">{stats.totalUsers}</p>
        </div>
        <div className="bg-yellow-500 text-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-2">Companies Pending Approval</h2>
          <p className="text-3xl">{stats.pendingCompanies}</p>
        </div>
        <div className="bg-green-600 text-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-2">Jobs Pending Approval</h2>
          <p className="text-3xl">{stats.pendingJobs}</p>
        </div>
        <div className="bg-purple-600 text-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-2">Total Applications</h2>
          <p className="text-3xl">{stats.totalApplications}</p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => window.location.href = "/admin/users"}
            className="px-5 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Manage Users
          </button>
          <button
            onClick={() => window.location.href = "/admin/companies"}
            className="px-5 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Approve Companies
          </button>
          <button
            onClick={() => window.location.href = "/admin/jobs"}
            className="px-5 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Approve Jobs
          </button>
          <button
            onClick={() => window.location.href = "/admin/send-email"}
            className="px-5 py-3 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          >
            Send Email Notifications
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
        <p className="text-gray-600 italic">Coming soon: activity logs, recent approvals, and system notifications.</p>
      </section>
    </div>
  );
}
