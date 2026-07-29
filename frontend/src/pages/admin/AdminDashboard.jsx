import { useCallback } from 'react';
import { FiUsers, FiBriefcase, FiCheckCircle, FiFileText } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import StatCard from '../../components/admin/StatCard';
import Badge from '../../components/common/Badge';
import { useFetch } from '../../hooks/useFetch';
import { getAdminDashboard } from '../../services/dashboardService';

const AdminDashboard = () => {
  const fetcher = useCallback(() => getAdminDashboard(), []);
  const { data, loading, error } = useFetch(fetcher, [fetcher]);

  if (loading) return <Spinner label="Loading dashboard statistics…" />;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const { studentCount, jobs, applicationCount, applicationsByStatus } = data.data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-heading">Admin Dashboard</h2>
        <p className="page-subheading">An overview of placement activity across the college.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiUsers} label="Registered Students" value={studentCount} accent="text-brand-700 bg-brand-50" />
        <StatCard icon={FiBriefcase} label="Active Jobs" value={jobs.active} accent="text-green-700 bg-green-50" />
        <StatCard icon={FiCheckCircle} label="Closed Jobs" value={jobs.closed} accent="text-gray-600 bg-gray-100" />
        <StatCard icon={FiFileText} label="Applications Received" value={applicationCount} accent="text-purple-700 bg-purple-50" />
      </div>

      <Card title="Applications by Status">
        {Object.keys(applicationsByStatus || {}).length === 0 ? (
          <p className="text-sm text-gray-500">No applications yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {Object.entries(applicationsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2">
                <Badge status={status} />
                <span className="text-sm font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
