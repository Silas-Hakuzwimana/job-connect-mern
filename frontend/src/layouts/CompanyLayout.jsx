import CompanyHeader from "../components/headers/CompanyHeader";
import CompanyFooter from "../components/footers/CompanyFooter";
import CompanyNavbar from "../components/company/CompanyNavbar";
import { Outlet } from "react-router-dom";

export default function CompanyLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full">
        <CompanyHeader />
      </header>

      {/* Navbar */}
      <nav className="w-full">
        <CompanyNavbar />
      </nav>

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto">
        <CompanyFooter />
      </footer>
    </div>
  );
}
