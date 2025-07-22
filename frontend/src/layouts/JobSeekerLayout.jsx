import JobSeekerHeader from "../components/headers/JobSeekerHeader";
import JobSeekerFooter from "../components/footers/JobSeekerFooter";
import JobSeekerNavbar from "../components/jobseekerComponents/JobSeekerNavBar";

export default function JobSeekerLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <JobSeekerHeader />
            <JobSeekerNavbar/>
            <main className="flex-1 bg-gray-50 p-6">{children}</main>
            <JobSeekerFooter />
        </div>
    );
}