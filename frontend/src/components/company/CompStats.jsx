import { useEffect, useState, useContext } from "react";
import { Briefcase, Users, Bell, PlusCircle } from "lucide-react";
import { fetchCompanyStats } from "../../services/companyApi";
import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../LoadingSpinner";
import { useNavigate } from "react-router-dom";

const CompStats = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    newNotifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchCompanyStats();
        setStats({
          totalJobs: data?.totalJobs || 0,
          totalApplicants: data?.totalApplicants || 0,
          newNotifications: data?.newNotifications || 0,
        });
      } catch (err) {
        console.error("Failed to fetch company stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  const statItems = [
    {
      label: "Total Jobs",
      value: stats.totalJobs,
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      action: () => navigate("/company/post-job"),
    },
    {
      label: "Total Applicants",
      value: stats.totalApplicants,
      icon: <Users className="w-6 h-6 text-green-600" />,
    },
    {
      label: "New Notifications",
      value: stats.newNotifications,
      icon: <Bell className="w-6 h-6 text-yellow-600" />,
    },
    {
      label: "Post a New Job",
      value: "",
      icon: <PlusCircle className="w-6 h-6 text-indigo-600" />,
      action: () => navigate("/company/dashboard/post-job"),
    },
  ];

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Company Statistics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statItems.map((item, idx) => (
          <StatCard key={idx} {...item} />
        ))}
      </div>
    </section>
  );
};

// Reusable StatCard
const StatCard = ({ label, value, icon, action }) => {
  return (
    <div
      onClick={action || undefined}
      role={action ? "button" : undefined}
      tabIndex={action ? 0 : undefined}
      onKeyPress={action ? (e) => e.key === "Enter" && action() : undefined}
      className={`p-5 bg-white rounded-xl shadow-sm flex items-center space-x-4 transition duration-200
        ${action ? "cursor-pointer border border-blue-200 hover:border-blue-400 hover:shadow-md" : ""}`}
    >
      <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        {value !== "" && <p className="text-xl font-bold text-gray-800">{value}</p>}
      </div>
    </div>
  );
};

export default CompStats;
