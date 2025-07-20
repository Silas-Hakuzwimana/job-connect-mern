import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Layout from "./components/Layout";
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import JobSeekerDashboard from "./pages/jobseeker/JobSeekerDashboard";
import NotFound from "./pages/NotFound";
import Logout from "./pages/Logout";
import { ToastContainer } from 'react-toastify';

// Enhanced Loading component
function LoadingPage() {
    return (

        // Full-screen loading spinner with gradient background
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
}

// Enhanced Protected Route with better UX
function ProtectedRoute({ children, roles, fallbackPath = "/" }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <LoadingPage />;

    if (!user) {
        // Redirect to login with return URL
        return <Navigate to={`/login?returnTo=${encodeURIComponent(window.location.pathname)}`} replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to={fallbackPath} replace />;
    }

    return children;
}

// Public Route (redirects authenticated users)
function PublicRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <LoadingPage />;

    // If user is logged in, redirect to appropriate dashboard
    if (user) {
        switch (user.role) {
            case 'admin':
                return <Navigate to="/admin" replace />;
            case 'company':
                return <Navigate to="/company/dashboard" replace />;
            case 'jobseeker':
                return <Navigate to="/jobseeker/dashboard" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return children;
}

export default function App() {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <Routes>
                {/* Public pages without Layout */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/logout"
                    element={
                        <Logout />
                    }
                />

                {/* Public Home page with Layout */}
                <Route
                    path="/"
                    element={
                        <Layout>
                            <Home />
                        </Layout>
                    }
                />

                {/* Job-related routes */}
                <Route
                    path="/jobs"
                    element={
                        <ProtectedRoute roles={["jobseeker", "company", "admin"]}>
                            <Layout>
                                <Jobs />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/jobs/:id"
                    element={
                        <ProtectedRoute roles={["jobseeker", "company", "admin"]}>
                            <Layout>
                                <JobDetails />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* User Profile */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute roles={["jobseeker", "company", "admin"]}>
                            <Layout>
                                <Profile />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Company Dashboard */}
                <Route
                    path="/company/dashboard"
                    element={
                        <ProtectedRoute roles={["company"]} fallbackPath="/jobs">
                            <Layout>
                                <CompanyDashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                 {/* JobSeeker Dashboard */}
                <Route
                    path="/jobseeker/*"
                    element={
                        <ProtectedRoute roles={["jobseeker"]} fallbackPath="/jobseeker/dashboard">
                            <Layout>
                                <JobSeekerDashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Admin Dashboard */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute roles={["admin"]} fallbackPath="/jobs">
                            <Layout>
                                <AdminDashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all route for 404 */}
                <Route
                    path="*"
                    element={
                        <Layout>
                            <NotFound />
                        </Layout>
                    }
                />
            </Routes>
        </>
    );
}