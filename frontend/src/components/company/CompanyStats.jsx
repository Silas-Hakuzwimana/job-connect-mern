// src/components/company/CompanyStats.jsx
import { useEffect, useState } from "react";
import { Briefcase, Users, Bell, PlusCircle } from "lucide-react";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";

const CompanyStats = ({ onPostJobClick }) => {
  const [stats, setStats] = useState({
    total_jobs: 0,
    total_applicants: 0,
    unread_notifications: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/company/stats",
        { withCredentials: true }
      );
      setStats(res.data || {});
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<Briefcase className="w-6 h-6 text-indigo-500" />}
        label="Total Jobs Posted"
        value={stats.total_jobs}
      />
      <StatCard
        icon={<Users className="w-6 h-6 text-green-500" />}
        label="Total Applicants"
        value={stats.total_applicants}
      />
      <StatCard
        icon={<Bell className="w-6 h-6 text-yellow-500" />}
        label="New Notifications"
        value={stats.unread_notifications}
      />
      <StatCard
        icon={<PlusCircle className="w-6 h-6 text-blue-500" />}
        label="Post a New Job"
        value=""
        action
        onClick={onPostJobClick}
      />
    </div>
  );
};

const StatCard = ({ icon, label, value, action, onClick }) => {
  const baseClasses =
    "p-5 bg-white rounded-xl shadow-sm flex items-center space-x-4 transition";
  const hoverClasses = action
    ? "cursor-pointer border border-blue-200 hover:border-blue-400 hover:shadow-md"
    : "";

  return (
    <div className={`${baseClasses} ${hoverClasses}`} onClick={action ? onClick : undefined}>
      <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        {value !== "" && <p className="text-xl font-bold text-gray-800">{value}</p>}
      </div>
    </div>
  );
};

export default CompanyStats;
