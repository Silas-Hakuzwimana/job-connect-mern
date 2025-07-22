import  { useEffect, useState } from 'react';
import { getAdminStats } from '../../services/adminApis';

export default function StatsOverview() {
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 });

  useEffect(() => {
    getAdminStats().then(res => setStats(res.data));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold">Users</h3>
        <p className="text-2xl">{stats.users}</p>
      </div>
      <div className="p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold">Jobs</h3>
        <p className="text-2xl">{stats.jobs}</p>
      </div>
      <div className="p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold">Applications</h3>
        <p className="text-2xl">{stats.applications}</p>
      </div>
    </div>
  );
}
