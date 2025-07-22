import{ useEffect, useState } from 'react';
import { fetchApplications } from '../../services/adminApis';

export default function ApplicationManagement() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications().then((res) => setApplications(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Applications</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>User</th><th>Job</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app._id}>
              <td>{app.user?.name}</td>
              <td>{app.job?.title}</td>
              <td>{app.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
