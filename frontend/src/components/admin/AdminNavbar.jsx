import { useState, useContext, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Briefcase, Users, FileText, BarChart2, Bell, Menu, X, User } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { getNotificationsCount } from "../../services/notificationService"; // create this service

export default function AdminNavbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const pollingInterval = useRef(null);

  const basePath = "/admin/dashboard";

  const navLinks = [
    { name: "Dashboard", path: "", icon: <BarChart2 size={18} /> },
    { name: "Users", path: "users", icon: <Users size={18} /> },
    { name: "Jobs", path: "jobs", icon: <Briefcase size={18} /> },
    { name: "Applications", path: "applications", icon: <FileText size={18} /> },
    { name: "Companies", path: "companies", icon: <FileText size={18} /> },
    { name: "Settings", path: "settings", icon: <FileText size={18} /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
    }
  };

  const loadNotifications = async () => {
    try {
      const count = await getNotificationsCount();
      setNotificationsCount(count);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  // Poll notifications every 30s
  useEffect(() => {
    loadNotifications();
    pollingInterval.current = setInterval(loadNotifications, 30000);
    return () => clearInterval(pollingInterval.current);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const profileImg = user?.profilePic || null;
  const profileName = user?.name || "Admin";

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <Link
              to={basePath}
              className="flex items-center text-xl font-bold text-indigo-600"
              onClick={() => setMenuOpen(false)}
            >
              <Briefcase className="w-6 h-6 mr-1" />
              AdminPanel
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={`${basePath}/${link.path}`}
                className={({ isActive }) =>
                  `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition ${isActive
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Link
              to={`${basePath}/notifications`}
              className="relative text-gray-600 hover:text-gray-800"
            >
              <Bell className="h-6 w-6" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full px-1.5">
                  {notificationsCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="Admin avatar"
                    className="h-9 w-9 rounded-full object-cover border"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center border">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {profileName}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 z-50">
                  <Link
                    to={`${basePath}/profile`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to={`${basePath}/settings`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                  >
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
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={`${basePath}/${link.path}`}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 border-b text-sm ${isActive ? "text-indigo-600 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
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
