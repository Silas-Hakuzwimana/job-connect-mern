import JobSeekerNavbar from '../../components/JobSeekerNavBar';


const JobSeekerDashboard = () => {
    return (

        <div className="min-h-screen bg-gray-100 p-6">
            <JobSeekerNavbar />


            <h1 className="text-2xl font-bold mb-4">Job Seeker Dashboard</h1>
            <p>Welcome to your dashboard! Here you can manage your profile, search for jobs, and track your applications.</p>
        </div>
    );
}

export default JobSeekerDashboard;
