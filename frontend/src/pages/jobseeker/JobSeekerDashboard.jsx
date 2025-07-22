import JobSeekerLayout from '../../layouts/JobSeekerLayout';
const JobSeekerDashboard = () => {
    return (
        <JobSeekerLayout>
            <div className="min-h-screen bg-gray-100 p-6">

                <h1 className="text-2xl font-bold mb-4">Job Seeker Dashboard</h1>
                <p>Welcome to your dashboard! Here you can manage your profile, search for jobs, and track your applications.</p>
            </div>
        </JobSeekerLayout>
    );
}

export default JobSeekerDashboard;
