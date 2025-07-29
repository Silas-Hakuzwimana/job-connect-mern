import JobSeekerHeader from "../components/headers/JobSeekerHeader";
import JobSeekerFooter from "../components/footers/JobSeekerFooter";
import JobSeekerNavbar from "../components/jobseeker/JobSeekerNavBar";
import { Outlet } from "react-router-dom";

export default function JobSeekerLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <JobSeekerHeader />
            <JobSeekerNavbar/>
            {/* Main content area */}
            <Outlet />
            <main className="flex-1 bg-gray-50 p-6">{children}</main>

            
            {/* Footer */}
            <JobSeekerFooter />
        </div>
    );
}