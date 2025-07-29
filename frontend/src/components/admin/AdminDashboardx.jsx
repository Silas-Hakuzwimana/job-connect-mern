import UserManagement from './UserManagement';
import JobManagement from './JobManagement';
import ApplicationViewer from './ApplicationViewer';
import QualificationManager from './QualificationManager';

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <UserManagement />
      <JobManagement />
      <ApplicationViewer />
      <QualificationManager />
    </div>
  );
}
