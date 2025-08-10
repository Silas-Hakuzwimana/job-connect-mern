import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Dashboards by role
import JobSeekerDashboard from "./pages/jobseeker/JobSeekerDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Logout from "./pages/Logout";

// Authenticated general pages
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Profiles from "./pages/Profiles";
import CompanyManager from "./pages/admin/CompanyManager";
import NotFound from "./pages/NotFound";

//Layout components
import AdminLayout from "./layouts/AdminLayout";
import JobSeekerLayout from "./layouts/JobSeekerLayout";

// Global layout wrapper
import Layout from "./components/Layout";

//Jobseeker dashboard components
import BookMark from "./components/jobseeker/BookMark";
import Settings from "./components/jobseeker/Settings";
import ApplicationsPage from "./components/jobseeker/ApplicationPage";
import Notifications from "./components/jobseeker/Notifications";
import Profile from "./components/jobseeker/Profile";
import Qualifications from "./components/jobseeker/Qualifications";


//Admin dashboard components
import UserManagement from "./components/admin/UserManagement";
import JobManagement from "./components/admin/JobManagement";
import ApplicationManagement from "./components/admin/ApplicationManager";

//Company dashboard components
// import CompanyNavbar from "./components/company/CompanyNavbar";
import CompanyProfileCard from "./components/company/CompanyProfileCard";
import CompanyStats from "./components/company/CompanyStats";
import CompanyLayout from "./layouts/CompanyLayout";
import NotificationsPanel from "./components/company/NotificationsPanel";
import JobListingsTable from "./components/company/JobListingsTable";
import ApplicantsList from "./components/company/ApplicantsList";
import Applications from "./components/company/Applications";



// ------------------------
// Utility Components
// ------------------------

// Full-page loading UI
function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children, roles, fallbackPath = "/" }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingPage />;

  if (!user) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(window.location.pathname)}`} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}

// Public-only route (redirect if logged in)
function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingPage />;

  if (user) {
    const dashboardPaths = {
      admin: "/admin/dashboard",
      employer: "/company/dashboard",
      jobseeker: "/jobseeker/dashboard",
    };
    return <Navigate to={dashboardPaths[user.role] || "/"} replace />;
  }

  return children;
}


// ------------------------
// Main App Component
// ------------------------

export default function App() {
  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Route Definitions */}
      <Routes>

        {/* Public Auth Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/logout" element={<Logout />} />

        {/* Public Home Page */}
        <Route path="/" element={<Layout><Home /></Layout>} />

        {/* Protected General Pages */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute roles={["jobseeker", "company", "admin"]}>
              <Layout><Jobs /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute roles={["jobseeker", "company", "admin"]}>
              <Layout><JobDetails /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["jobseeker", "company", "admin"]}>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          }
        />

        {/* ✅ JobSeeker Dashboard & Nested Routes */}
        <Route
          path="/jobseeker/dashboard"
          element={
            <ProtectedRoute roles={["jobseeker"]} fallbackPath="/jobseeker/dashboard">
              <JobSeekerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<JobSeekerDashboard />} />
          <Route path="bookmarks" element={<BookMark />} />
          <Route path="profile" element={<Profile />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="applications" element={< ApplicationsPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="qualifications" element={<Qualifications />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* ✅ Company Dashboard (Simple) */}
        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute roles={["employer"]} fallbackPath="/company/dashboard">
              <CompanyLayout />
            </ProtectedRoute>
          }
        />
        {/* This means: /company/dashboard shows ComapnyDashboard */}
        <Route index element={<CompanyDashboard />} />

        {/* /company/dashboard/stats */}
        <Route path="stats" element={<CompanyStats />} />
        {/* /company/dashboard/applicants */}
        <Route path="applicants" element={<ApplicantsList />} />

        {/* /company/dashboard/jobs */}
        <Route path="jobs" element={<JobListingsTable />} />

        {/* /company/dashboard/applications */}
        <Route path="applications" element={<Applications />} />

        {/* /company/dashboard/companies */}
        <Route path="profile" element={<CompanyProfileCard />} />
        {/* /company/dashboard/notifications */}
        <Route path="notifications" element={<NotificationsPanel />} />
        <Route />

        {/* ✅ Admin Dashboard & Nested Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]} fallbackPath="/admin/dashboard">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* This means: /admin/dashboard shows AdminDashboard */}
          <Route index element={<AdminDashboard />} />

          {/* /admin/dashboard/users */}
          <Route path="users" element={<UserManagement />} />

          {/* /admin/dashboard/jobs */}
          <Route path="jobs" element={<JobManagement />} />

          {/* /admin/dashboard/applications */}
          <Route path="applications" element={<ApplicationManagement />} />

          {/* /admin/dashboard/companies */}
          <Route path="companies" element={<CompanyManager />} />
        </Route>


        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
