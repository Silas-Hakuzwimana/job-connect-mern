import CompanyHeader from "../components/headers/CompanyHeader";
import CompanyFooter from "../components/footers/CompanyFooter";
import CompanyNavbar from "../components/company/CompanyNavbar";
import { Outlet } from "react-router-dom";

export default function CompanyLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <CompanyHeader />

      {/* Add the navbar here */}
      <CompanyNavbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <CompanyFooter />
    </div>
  );
}
