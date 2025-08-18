import { Briefcase, Users, Bell, PlusCircle } from "lucide-react";

const CompanyStats = ({ stats, onPostJobClick }) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center p-6 text-gray-500">
        Loading stats...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<Briefcase className="w-6 h-6 text-indigo-500" />}
        label="Total Jobs Posted"
        value={stats.totalJobs || 0}
      />
      <StatCard
        icon={<Users className="w-6 h-6 text-green-500" />}
        label="Total Applicants"
        value={stats.totalApplicants || 0}
      />
      <StatCard
        icon={<Bell className="w-6 h-6 text-yellow-500" />}
        label="New Notifications"
        value={stats.newNotifications || 0}
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

// Reusable StatCard
const StatCard = ({ icon, label, value, action, onClick }) => {
  const baseClasses =
    "p-5 bg-white rounded-xl shadow-sm flex items-center space-x-4 transition duration-200";
  const hoverClasses = action
    ? "cursor-pointer border border-blue-200 hover:border-blue-400 hover:shadow-md"
    : "";

  return (
    <div
      className={`${baseClasses} ${hoverClasses}`}
      onClick={action ? onClick : undefined}
      role={action ? "button" : undefined}
      tabIndex={action ? 0 : undefined}
      onKeyPress={action ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        {value !== "" && <p className="text-xl font-bold text-gray-800">{value}</p>}
      </div>
    </div>
  );
};

export default CompanyStats;
