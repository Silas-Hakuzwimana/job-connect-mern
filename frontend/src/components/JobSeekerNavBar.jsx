import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Briefcase, PersonStanding } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
export default function JobSeekerNavbar({ user, notificationsCount }) {
    const [menuOpen, setMenuOpen] = useState(false);
    
    //const { user: authUser } = React.useContext(AuthContext);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left: Brand + Links */}
                    <div className="flex">
                        <Link
                            to="/dashboard"
                            className="flex items-center text-2xl font-bold text-indigo-600"
                        >
                            <Briefcase className="h-4 w-4" />
                            JobConnect
                        </Link>

                        <div className="hidden sm:-my-px sm:ml-10 sm:flex sm:space-x-8">
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
                                        `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                                            ? "border-indigo-500 text-gray-900"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`
                                    }
                                >
                                    {name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Right: Search, Notifications, Profile */}
                    <div className="flex items-center">
                        {/* Search box */}
                        <div className="hidden sm:block">
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Notifications */}
                        <Link
                            to="/notifications"
                            className="ml-4 relative text-gray-500 hover:text-gray-700"
                            aria-label="Notifications"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                            >
                                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 01-3.46 0"></path>
                            </svg>

                            {notificationsCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                                    {notificationsCount}
                                </span>
                            )}
                        </Link>

                        {/* Profile dropdown */}
                        <div className="ml-4 relative">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                id="user-menu-button"
                                aria-expanded={menuOpen}
                                aria-haspopup="true"
                            >
                                <img
                                    className="h-9 w-9 rounded-full object-cover"
                                    src={user?.profilePicture || <PersonStanding className="h-9 w-9 text-gray-400" />}
                                    alt="User avatar"
                                />
                                <span className="hidden ml-2 text-gray-700 font-medium sm:block">
                                    {user?.name || "User"}
                                </span>
                                <svg
                                    className="ml-1 h-4 w-4 text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {menuOpen && (
                                <div
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu-button"
                                    tabIndex={-1}
                                >
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                                        role="menuitem"
                                        tabIndex={-1}
                                    >
                                        Profile & Resume
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                                        role="menuitem"
                                        tabIndex={-1}
                                    >
                                        Settings
                                    </Link>
                                    <div className="border-t border-gray-200"></div>
                                    <Link
                                        to="/logout"
                                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                                        role="menuitem"
                                        tabIndex={-1}
                                    >
                                        Logout
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-controls="mobile-menu"
                            aria-expanded={menuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {menuOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            {menuOpen && (
                <div className="sm:hidden" id="mobile-menu">
                    <div className="pt-2 pb-3 space-y-1">
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
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive
                                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                                    } ${isDanger ? "text-red-600 hover:bg-red-100 hover:border-red-400" : ""}`
                                }
                            >
                                {name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
