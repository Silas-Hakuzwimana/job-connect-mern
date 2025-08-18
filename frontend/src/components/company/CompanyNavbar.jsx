import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
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
  SettingsIcon,
} from "lucide-react";
import LogoutButton from "../LogoutButton";

const CompanyNavbar = () => {
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const basePath = "/company/dashboard";

  const navLinks = [
    { name: "Dashboard", path: "", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Jobs", path: "jobs", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Applicants", path: "applicants", icon: <Users className="w-5 h-5" /> },
    { name: "Applications", path: "applications", icon: <FileText className="w-5 h-5" /> },
    { name: "Notifications", path: "notifications", icon: <Bell className="w-5 h-5" /> },
    { name: "Stats", path: "stats", icon: <BarChart2 className="w-5 h-5" /> },
    { name: "Settings", path: "settings", icon: <SettingsIcon className="w-5 h-5" /> },
    { name: "Profile", path: "profile", icon: <UserCircle className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setMenuOpen(false)}
          >
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span className="text-lg font-bold text-gray-800 select-none">
              CompanyPortal
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={`${basePath}/${link.path}`}
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

          {/* User Section & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {user && (
              <span className="hidden sm:inline text-gray-700 text-sm select-none">
                Hi, <span className="font-medium">{user.name}</span>
              </span>
            )}
            <LogoutButton />
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
          }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={`${basePath}/${link.path}`}
              onClick={() => setMenuOpen(false)}
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
    </nav>
  );
};

export default CompanyNavbar;
