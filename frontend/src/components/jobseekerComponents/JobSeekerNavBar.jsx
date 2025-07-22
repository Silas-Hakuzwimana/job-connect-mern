import { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { Briefcase, User } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function JobSeekerNavbar({ notificationsCount = 0 }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useContext(AuthContext);

    const profileImg = user?.profilePicture || null;

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Brand & Navigation */}
                    <div className="flex items-center space-x-8">
                        <Link to="../dashboard" className="flex items-center text-2xl font-bold text-indigo-600">
                            <Briefcase className="h-5 w-5 mr-1" />
                            JobConnect
                        </Link>

                        <div className="hidden sm:flex space-x-6">
                            {[
                                { name: "Dashboard", to: "/dashboard" },
                                { name: "Browse Jobs", to: "/jobs" },
                                { name: "Bookmarks", to: "/bookmarks" },
                                { name: "Applications", to: "/applications" },
                            ].map(({ name, to }) => (
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

                    {/* Search + Notification + Profile */}
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            className="hidden sm:block border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                        />

                        {/* Notifications */}
                        <Link to="/notifications" className="relative text-gray-600 hover:text-gray-800">
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

                        {/* User dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
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
                                <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {/* Dropdown */}
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 z-50">
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100">
                                        Profile & Resume
                                    </Link>
                                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100">
                                        Settings
                                    </Link>
                                    <div className="border-t border-gray-200" />
                                    <Link to="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100">
                                        Logout
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="sm:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="sm:hidden px-4 pb-4">
                    {[
                        { name: "Dashboard", to: "/dashboard" },
                        { name: "Browse Jobs", to: "/jobs" },
                        { name: "Bookmarks", to: "/bookmarks" },
                        { name: "Applications", to: "/applications" },
                        { name: "Profile & Resume", to: "/profile" },
                        { name: "Settings", to: "/settings" },
                        { name: "Logout", to: "/logout", isDanger: true },
                    ].map(({ name, to, isDanger }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={`block py-2 border-b text-sm ${isDanger ? "text-red-600 hover:bg-red-100" : "text-gray-700 hover:bg-gray-50"
                                }`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {name}
                        </NavLink>
                    ))}
                </div>
            )}
        </nav>
    );
}
