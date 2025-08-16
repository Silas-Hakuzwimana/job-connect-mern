import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import JobListingsTable from "../../components/company/JobListingsTable";
import NotificationsPanel from "../../components/company/NotificationsPanel";
import CompanyStats from "../../components/company/CompanyStats";
import CompanyProfileCard from "../../components/company/CompanyProfileCard";
import {
  fetchJobsByCompany,
  fetchCompanyStats,
  fetchMyCompanyProfile
} from "../../services/companyApi";
import { fetchNotifications } from "../../services/notificationService";


const CompanyDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    newNotifications: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [companyProfile, setCompanyProfile] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setLoadingData(true);
      try {
        const companyProfile = await fetchMyCompanyProfile();
        if (!companyProfile?._id) {
          console.error('No company profile found');
          setLoadingData(false);
          return;
        }

        setCompanyProfile(companyProfile);

        const companyId = companyProfile._id;
        console.log('Fetching jobs for companyId:', companyId);

        // Only call fetchJobsByCompany if companyId exists
        const [jobsRes, notifRes, statsRes] = await Promise.all([
          fetchJobsByCompany(companyId),
          fetchNotifications(),
          fetchCompanyStats()
        ]);

        setJobs(jobsRes?.jobs || []);
        setNotifications(
          (notifRes?.data || []).filter(n => !n.hiddenBy?.includes(user.id))
        );

        setStats({
          totalJobs: statsRes?.totalJobs || 0,
          totalApplicants: statsRes?.totalApplicants || 0,
          newNotifications: (notifRes?.data || []).length,
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user?.id]);


  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Company Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome, {user?.name || "Guest"}!<br />
          Here you can post jobs, view applicants, and manage your listings.
        </p>
      </header>

      {/* Company profile */}
      <CompanyProfileCard company={companyProfile} />

      {/* Company Stats */}
      <CompanyStats stats={stats} onPostJobClick={() => navigate("/company/post-job")} />

      {/* Job Listings Section */}
      <section className="mt-10 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Job Listings
        </h2>
        <JobListingsTable jobs={jobs} />
      </section>

      {/* Notifications Section */}
      <section className="mt-10 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Notifications
        </h2>
        <NotificationsPanel notifications={notifications} />
      </section>
    </div>
  );
};

// Reusable stat card component
const StatCard = ({ icon, label, value, action, onClick }) => {
  return (
    <div
      onClick={action ? onClick : undefined}
      className={`p-5 bg-white rounded-xl shadow-sm flex items-center space-x-4 transition hover:shadow-md ${action ? "cursor-pointer border border-blue-200 hover:border-blue-400" : ""
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
