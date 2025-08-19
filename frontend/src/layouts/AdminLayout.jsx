import AdminHeader from "../components/headers/AdminHeader";
import AdminFooter from "../components/footers/AdminFooter";
import AdminNavbar from "../components/admin/AdminNavbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full">
        <AdminHeader />
      </header>

      {/* Navbar */}
      <nav className="w-full">
        <AdminNavbar />
      </nav>

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto">
        <AdminFooter />
      </footer>
    </div>
  );
}
