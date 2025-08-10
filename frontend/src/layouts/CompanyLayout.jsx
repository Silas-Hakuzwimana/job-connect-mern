import CompanyHeader from "../components/headers/CompanyHeader";
import CompanyFooter from "../components/footers/CompanyFooter";
import CompanyNavbar from "../components/company/CompanyNavbar";

export default function CompanyLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <CompanyHeader />
      <CompanyNavbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <CompanyFooter />
    </div>
  );
}