import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ------------------------
// Dashboards
// ------------------------
import JobSeekerDashboard from "./pages/jobseeker/JobSeekerDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

// ------------------------
// Public Pages
// ------------------------
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Logout from "./pages/Logout";

// ------------------------
// Authenticated General Pages
// ------------------------
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";

// ------------------------
// JobSeeker Components
// ------------------------
import BookMark from "./components/jobseeker/BookMark";
import Settings from "./components/jobseeker/Settings";
import ApplicationsPage from "./components/jobseeker/ApplicationPage";
import Notifications from "./components/jobseeker/Notifications";
import Profile from "./components/jobseeker/Profile";
import Qualifications from "./components/jobseeker/Qualifications";

// ------------------------
// Admin Components
// ------------------------
import UserManagement from "./components/admin/UserManagement";
import JobManagement from "./components/admin/JobManagement";
import ApplicationManagement from "./components/admin/ApplicationManager";
import AdminSettings from "./components/admin/Settings";
import CompanyManager from "./pages/admin/CompanyManager";

// ------------------------
// Company Components
// ------------------------
import CompanyDetails from "./components/company/CompanyDetails";
import CompStats from "./components/company/CompStats";
import NotificationsPanel from "./components/company/NotificationsPanel";
import JobListingsTable from "./components/company/JobListingsTable";
import ApplicantsList from "./components/company/ApplicantsList";
import Applications from "./components/company/Applications";
import PostJob from "./components/company/PostJob";
import CompanySettings from "./components/company/Settings";

// ------------------------
// Layouts
// ------------------------
import Layout from "./components/Layout";
import JobSeekerLayout from "./layouts/JobSeekerLayout";
import CompanyLayout from "./layouts/CompanyLayout";
import AdminLayout from "./layouts/AdminLayout";

// ------------------------
// Utility Components
// ------------------------
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

// ------------------------
// Protected Route
// ------------------------
function ProtectedRoute({ children, roles, fallbackPath = "/" }) {
  const { user, loading, isAuthChecked } = useContext(AuthContext);

  if (loading || !isAuthChecked) return <LoadingPage />; // wait for auth check

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) return <Navigate to={fallbackPath} replace />;

  return children;
}

//----------------------
// Public-Only routes
//-----------------------

function PublicRoute({ children }) {
  const { user, loading, isAuthChecked } = useContext(AuthContext);

  if (loading || !isAuthChecked) return <LoadingPage />;

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

      <Routes>
        {/* ------------------------
            Public Pages
        ------------------------ */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/logout" element={<Logout />} />

        {/* ------------------------
            Protected General Pages
        ------------------------ */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute roles={["jobseeker", "employer", "admin"]}>
              <Layout><Jobs /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute roles={["jobseeker", "employer", "admin"]}>
              <Layout><JobDetails /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["jobseeker", "employer", "admin"]}>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          }
        />

        {/* ------------------------
            JobSeeker Dashboard
        ------------------------ */}
        <Route
          path="/jobseeker/dashboard"
          element={
            <ProtectedRoute roles={["jobseeker"]}>
              <JobSeekerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<JobSeekerDashboard />} />
          <Route path="bookmarks" element={<BookMark />} />
          <Route path="profile" element={<Profile />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="qualifications" element={<Qualifications />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* ------------------------
            Company Dashboard
        ------------------------ */}
        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute roles={["employer"]}>
              <CompanyLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CompanyDashboard />} />
          <Route path="stats" element={<CompStats />} />
          <Route path="applicants" element={<ApplicantsList />} />
          <Route path="jobs" element={<JobListingsTable />} />
          <Route path="applications" element={<Applications />} />
          <Route path="profile" element={<CompanyDetails />} />
          <Route path="notifications" element={<NotificationsPanel />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="settings" element={<CompanySettings />} />
        </Route>

        {/* ------------------------
            Admin Dashboard
        ------------------------ */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="jobs" element={<JobManagement />} />
          <Route path="applications" element={<ApplicationManagement />} />
          <Route path="companies" element={<CompanyManager />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ------------------------
            404 Page
        ------------------------ */}
        <Route
          path="*"
          element={
            <Layout>
              <p className="text-center mt-10 text-gray-600 text-xl">
                Page Not Found
              </p>
            </Layout>
          }
        />
      </Routes>
    </>
  );
}
