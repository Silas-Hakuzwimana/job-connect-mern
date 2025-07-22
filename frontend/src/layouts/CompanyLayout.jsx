import CompanyHeader from "../components/headers/CompanyHeader";
import CompanyFooter from "../components/footers/CompanyFooter";

export default function CompanyLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <CompanyHeader />
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
      <CompanyFooter />
    </div>
  );
}