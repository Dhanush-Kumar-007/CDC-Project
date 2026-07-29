import { useCallback } from 'react';
import { FiFileText } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import ApplicationStatusCard from '../../components/student/ApplicationStatusCard';
import { useFetch } from '../../hooks/useFetch';
import { getMyApplications } from '../../services/applicationService';

const MyApplications = () => {
  const fetcher = useCallback(() => getMyApplications(), []);
  const { data, loading, error } = useFetch(fetcher, [fetcher]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-heading">My Applications</h2>
        <p className="page-subheading">Track the status of every job you&apos;ve applied to.</p>
      </div>

      <Card>
        {loading ? (
          <Spinner label="Loading your applications…" />
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : data.data.length === 0 ? (
          <EmptyState
            icon={FiFileText}
            title="You haven&apos;t applied to any jobs yet"
            description="Once you apply to a job, you&apos;ll be able to track its status here."
          />
        ) : (
          <div className="space-y-3">
            {data.data.map((application) => (
              <ApplicationStatusCard key={application._id} application={application} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MyApplications;
