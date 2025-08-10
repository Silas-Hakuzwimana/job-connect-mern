// src/pages/company/CompanyDashboard.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Briefcase, Users, Bell, PlusCircle } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import JobListingsTable from "../../components/company/JobListingsTable";
import NotificationsPanel from "../../components/company/NotificationsPanel";
import CompanyStats from "../../components/company/CompanyStats";
import CompanyNavbar from "../../components/company/CompanyNavbar";
import CompanyProfileCard from "../../components/company/CompanyProfileCard";

const CompanyDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <CompanyNavbar />

      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Company Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome, {user?.name || "Guest"}!<br />
            Here you can post jobs, view applicants, and manage your listings.
          </p>
        </header>

        {/* Company Stats */}
        <CompanyStats onPostJobClick={() => navigate("/company/post-job")} />

        <CompanyProfileCard />
        {/* Stat Cards */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Briefcase className="w-6 h-6 text-indigo-500" />}
            label="Total Jobs Posted"
            value="12"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-green-500" />}
            label="Total Applicants"
            value="85"
          />
          <StatCard
            icon={<Bell className="w-6 h-6 text-yellow-500" />}
            label="New Notifications"
            value="3"
          />
          <StatCard
            icon={<PlusCircle className="w-6 h-6 text-blue-500" />}
            label="Post a New Job"
            action
            onClick={() => navigate("/company/post-job")}
          />
        </section>

        {/* Job Listings Section */}
        <section className="mt-10 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Job Listings
          </h2>
          <JobListingsTable />
        </section>

        {/* Notifications Section */}
        <section className="mt-10 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Notifications
          </h2>
          <NotificationsPanel />
        </section>
      </div>
    </>
  );
};

// Reusable stat card component
const StatCard = ({ icon, label, value, action, onClick }) => {
  return (
    <div
      onClick={action ? onClick : undefined}
      className={`p-5 bg-white rounded-xl shadow-sm flex items-center space-x-4 transition hover:shadow-md ${action
          ? "cursor-pointer border border-blue-200 hover:border-blue-400"
          : ""
        }`}
    >
      <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default CompanyDashboard;
