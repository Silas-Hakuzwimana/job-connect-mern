import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { Menu, LogOut, BarChart2, Users, Briefcase, FileText } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminNavbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const closeMenu = () => setMobileMenuOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  const navLinks = [
    { label: "Dashboard", icon: <BarChart2 size={18} />, to: "/admin/dashboard" },
    { label: "Users", icon: <Users size={18} />, to: "/admin/users" },
    { label: "Jobs", icon: <Briefcase size={18} />, to: "/admin/jobs" },
    { label: "Applications", icon: <FileText size={18} />, to: "/admin/applications" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard">
            <Briefcase className="h-8 w-8 " />
          </Link>
          <span className="text-lg font-bold hidden sm:inline">Admin Panel</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-800"
          onClick={toggleMobileMenu}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
