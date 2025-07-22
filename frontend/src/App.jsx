import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Global layout wrapper
import Layout from "./components/Layout";

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
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Dashboards by role
import JobSeekerDashboard from "./pages/jobseeker/JobSeekerDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";


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
      admin: "/admin",
      company: "/company/dashboard",
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

        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/logout" element={<Logout />} />

        {/* Public Home Page */}
        <Route path="/" element={<Layout><Home /></Layout>} />

        {/* Job Pages (protected for all roles) */}
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

        {/* Profile Page */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["jobseeker", "company", "admin"]}>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Dashboards by Role */}
        <Route
          path="/jobseeker/*"
          element={
            <ProtectedRoute roles={["jobseeker"]} fallbackPath="/jobseeker/dashboard">
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute roles={["company"]} fallbackPath="/company/dashboard">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute roles={["admin"]} fallbackPath="/admin/dashboard">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </>
  );
}
