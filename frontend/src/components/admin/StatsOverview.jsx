import { useEffect, useState } from 'react';
import { getAdminStats } from '../../services/adminApis';
import {
  HiUsers,
  HiUserGroup,
  HiOfficeBuilding,
  HiClock,
  HiBriefcase,
  HiCheckCircle,
  HiXCircle,
  HiClipboardList,
  HiUserCircle,
} from 'react-icons/hi';

export default function StatsOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobseekers: 0,
    totalCompanies: 0,
    totalAdmins: 0,
    pendingCompanies: 0,
    pendingJobs: 0,
    totalJobs: 0,
    approvedJobs: 0,
    rejectedJobs: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    getAdminStats().then(res => setStats(res.data));
  }, []);

  const statCards = [
    {
      id: 'totalUsers',
      label: 'Total Users',
      value: stats.totalUsers,
      icon: <HiUsers className="w-8 h-8 text-blue-600" />,
    },
    {
      id: 'totalJobseekers',
      label: 'Total Jobseekers',
      value: stats.totalJobseekers,
      icon: <HiUserGroup className="w-8 h-8 text-indigo-600" />,
    },
    {
      id: 'totalCompanies',
      label: 'Total Companies',
      value: stats.totalCompanies,
      icon: <HiOfficeBuilding className="w-8 h-8 text-yellow-600" />,
    },
    {
      id: 'totalAdmins',
      label: 'Total Admins',
      value: stats.totalAdmins,
      icon: <HiUserCircle className="w-8 h-8 text-green-600" />,
    },
    {
      id: 'pendingCompanies',
      label: 'Pending Companies',
      value: stats.pendingCompanies,
      icon: <HiClock className="w-8 h-8 text-orange-500" />,
    },
    {
      id: 'pendingJobs',
      label: 'Pending Jobs',
      value: stats.pendingJobs,
      icon: <HiClock className="w-8 h-8 text-orange-500" />,
    },
    {
      id: 'totalJobs',
      label: 'Total Jobs',
      value: stats.totalJobs,
      icon: <HiBriefcase className="w-8 h-8 text-green-600" />,
    },
    {
      id: 'approvedJobs',
      label: 'Approved Jobs',
      value: stats.approvedJobs,
      icon: <HiCheckCircle className="w-8 h-8 text-green-400" />,
    },
    {
      id: 'rejectedJobs',
      label: 'Rejected Jobs',
      value: stats.rejectedJobs,
      icon: <HiXCircle className="w-8 h-8 text-red-500" />,
    },
    {
      id: 'totalApplications',
      label: 'Total Applications',
      value: stats.totalApplications,
      icon: <HiClipboardList className="w-8 h-8 text-purple-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {statCards.map(({ id, label, value, icon }) => (
        <div
          key={id}
          className="flex items-center bg-white p-5 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="mr-4 p-3 bg-gray-100 rounded-full">{icon}</div>
          <div>
            <h3 className="text-gray-500 text-sm font-semibold">{label}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
