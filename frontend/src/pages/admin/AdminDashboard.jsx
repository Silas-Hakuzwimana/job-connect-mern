import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminLayout from "../../layouts/AdminLayout";
import { getAdminStats } from "../../services/adminApis";

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingCompanies: 0,
        pendingJobs: 0,
        totalApplications: 0,
    });

    const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadStats = async () => {
        try {
            const data = await getAdminStats();
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch admin stats:", err);
        } finally {
            setLoading(false);
        }
    };

    if (user?.token) {
        loadStats();
    } else {
        setLoading(false); // Avoid infinite loading if user is not set
    }
}, [user]);


if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
    );
}

return (
    <AdminLayout>
      
        {/* Main Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-700 mb-8">
                Welcome back, <span className="font-semibold">{user?.name}</span>
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Users" value={stats.totalUsers} bgColor="bg-blue-600" />
                <StatCard title="Companies Pending" value={stats.pendingCompanies} bgColor="bg-yellow-500" />
                <StatCard title="Jobs Pending" value={stats.pendingJobs} bgColor="bg-green-600" />
                <StatCard title="Total Applications" value={stats.totalApplications} bgColor="bg-purple-600" />
            </div>

            {/* Quick Actions */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <ActionButton text="Manage Users" color="blue" onClick={() => navigate("/admin/users")} />
                    <ActionButton text="Approve Companies" color="yellow" onClick={() => navigate("/admin/companies")} />
                    <ActionButton text="Approve Jobs" color="green" onClick={() => navigate("/admin/jobs")} />
                    <ActionButton text="Send Email Notifications" color="purple" onClick={() => navigate("/admin/send-email")} />
                </div>
            </section>

            {/* Recent Activities Placeholder */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
                <p className="text-gray-500 italic">Coming soon: Activity logs, approvals, and notifications.</p>
            </section>
        </div>
    </AdminLayout>
);
}

// Reusable StatCard component
function StatCard({ title, value, bgColor }) {
    return (
        <div className={`${bgColor} text-white rounded-lg p-6 shadow`}>
            <h3 className="text-lg font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}

// Reusable ActionButton component
function ActionButton({ text, color, onClick }) {
    const base = "px-5 py-3 text-white rounded transition font-medium";
    const bg = {
        blue: "bg-blue-500 hover:bg-blue-600",
        yellow: "bg-yellow-500 hover:bg-yellow-600",
        green: "bg-green-500 hover:bg-green-600",
        purple: "bg-purple-500 hover:bg-purple-600",
    };

    return (
        <button className={`${base} ${bg[color]}`} onClick={onClick}>
            {text}
        </button>
    );
}
