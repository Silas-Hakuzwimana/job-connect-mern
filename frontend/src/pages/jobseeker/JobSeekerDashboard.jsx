console.log("JobSeekerDashboard component rendered");

import React from 'react';
import LogoutButton from '../../components/LogoutButton';

const JobSeekerDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Job Seeker Dashboard</h1>
            <p>Welcome to your dashboard! Here you can manage your profile, search for jobs, and track your applications.</p>
            {/* Add more components or features as needed */}

            <LogoutButton />
        </div>
    );
}

export default JobSeekerDashboard;
