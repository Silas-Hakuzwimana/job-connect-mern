import { useState, useContext, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Briefcase, User } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { getNotificationsCount } from "../../services/notificationService";

export default function JobSeekerNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const pollingInterval = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      navigate("/login");
    }
  };

  const loadCount = async () => {
    try {
      const count = await getNotificationsCount();
      setNotificationsCount(count);
    } catch {
      toast.error("Failed to fetch notifications count.");
      setError("Failed to fetch notifications count");
    }
  };

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      await Promise.all([loadCount()]);
      setLoading(false);
    }
    fetchAll();

    pollingInterval.current = setInterval(fetchAll, 30000);
    return () => clearInterval(pollingInterval.current);
  }, []);

  const profileImg = user?.profilePicture || null;

  if (loading) return <p className="text-center p-4">Loading notifications...</p>;
  if (error) return <p className="text-center p-4 text-red-600">{error}</p>;

  const navLinks = [
    { name: "Dashboard", to: "/jobseeker/dashboard" },
    { name: "Browse Jobs", to: "/jobseeker/dashboard/jobs" },
    { name: "Bookmarks", to: "/jobseeker/dashboard/bookmarks" },
    { name: "Applications", to: "/jobseeker/dashboard/applications" },
    { name: "Qualifications", to: "/jobseeker/dashboard/qualifications" },
    { name: "Notifications", to: "/jobseeker/dashboard/notifications" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center space-x-8">
            <Link to="../dashboard" className="flex items-center text-2xl font-bold text-indigo-600">
              <Briefcase className="h-5 w-5 mr-1" />
              JobConnect
            </Link>

            {/* Desktop Nav */}
            <div className="hidden sm:flex space-x-6">
              {navLinks.map(({ name, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `text-sm font-medium ${isActive
                      ? "border-b-2 border-indigo-600 text-gray-900"
                      : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
                    } pb-1`
                  }
                >
                  {name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Link to="/jobseeker/dashboard/notifications" className="relative text-gray-600 hover:text-gray-800">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full px-1.5">
                  {notificationsCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="User avatar"
                    className="h-9 w-9 rounded-full object-cover border"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center border">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user?.name || "User"}
                </span>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 z-50">
                  <Link to="/jobseeker/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100">
                    Profile & Resume
                  </Link>
                  <Link to="/jobseeker/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100">
                    Settings
                  </Link>
                  <div className="border-t border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="sm:hidden px-4 pb-4">
          {navLinks.map(({ name, to }) => (
            <NavLink
              key={to}
              to={to}
              className="block py-2 border-b text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              {name}
            </NavLink>
          ))}
          <Link
            to="/jobseeker/dashboard/profile"
            className="block py-2 border-b text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileOpen(false)}
          >
            Profile & Resume
          </Link>
          <Link
            to="/jobseeker/dashboard/settings"
            className="block py-2 border-b text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileOpen(false)}
          >
            Settings
          </Link>
          <button
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="block py-2 border-b text-sm text-red-600 hover:bg-red-100 w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
