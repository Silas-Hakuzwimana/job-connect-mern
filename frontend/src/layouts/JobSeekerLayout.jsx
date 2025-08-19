import JobSeekerHeader from "../components/headers/JobSeekerHeader";
import JobSeekerFooter from "../components/footers/JobSeekerFooter";
import JobSeekerNavbar from "../components/jobseeker/JobSeekerNavBar";
import { Outlet } from "react-router-dom";

export default function JobSeekerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full">
        <JobSeekerHeader />
      </header>

      {/* Navbar */}
      <nav className="w-full">
        <JobSeekerNavbar />
      </nav>

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto">
        <JobSeekerFooter />
      </footer>
    </div>
  );
}
