import { useContext, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Briefcase,
  LayoutDashboard,
  UserCircle,
  Users,
  FileText,
  Bell,
  BarChart2,
  Menu,
  X,
} from "lucide-react";
import LogoutButton from "../LogoutButton";

const CompanyNavbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      path: "/company/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Jobs",
      path: "/company/dashboard/jobs",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      name: "Applicants",
      path: "/company/dashboard/applicants",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Applications",
      path: "/company/dashboard/applications",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Notifications",
      path: "/company/dashboard/notifications",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      name: "Stats",
      path: "/company/dashboard/stats",
      icon: <BarChart2 className="w-5 h-5" />,
    },
    {
      name: "Profile",
      path: "/company/dashboard/profile",
      icon: <UserCircle className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 text-center items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => {
              navigate("/company/dashboard");
              setMenuOpen(false); // close menu on logo click (mobile)
            }}
          >
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span className="text-lg font-bold text-gray-800 select-none">
              CompanyPortal
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive
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

          {/* User Section & Hamburger */}
          <div className="flex items-center space-x-4">
            {user && (
              <span className="hidden sm:inline text-gray-700 text-sm select-none">
                Hi, <span className="font-medium">{user.name}</span>
              </span>
            )}

            <LogoutButton />

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)} // close menu on nav click
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition ${isActive
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
        </div>
      )}
    </nav>
  );
};

export default CompanyNavbar;
