import StatsOverview from '../../components/admin/StatsOverview';

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
      <StatsOverview />
    </div>
  );
}
