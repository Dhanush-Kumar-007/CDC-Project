import { useCallback } from 'react';
import { FiBriefcase, FiClock, FiFileText } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import JobCard from '../../components/jobs/JobCard';
import ApplicationStatusCard from '../../components/student/ApplicationStatusCard';
import ProfileCompletionMeter from '../../components/student/ProfileCompletionMeter';
import { useFetch } from '../../hooks/useFetch';
import { getStudentDashboard } from '../../services/dashboardService';
import { formatDate } from '../../utils/formatDate';

const StudentDashboard = () => {
  const fetcher = useCallback(() => getStudentDashboard(), []);
  const { data, loading, error } = useFetch(fetcher, [fetcher]);

  if (loading) return <Spinner label="Loading your dashboard…" />;
  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  const { welcomeName, profileCompletion, latestJobs, upcomingDeadlines, appliedJobs } = data.data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-heading">Welcome back, {welcomeName?.split(' ')[0]}</h2>
        <p className="page-subheading">Here&apos;s what&apos;s happening with your placement activity.</p>
      </div>

      <Card>
        <ProfileCompletionMeter percentage={profileCompletion} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Latest Job Openings" subtitle="Newly posted opportunities">
          {latestJobs?.length === 0 ? (
            <EmptyState icon={FiBriefcase} title="No active jobs right now" description="Check back soon for new openings." />
          ) : (
            <div className="space-y-3">
              {latestJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </Card>

        <Card title="Upcoming Deadlines" subtitle="Don't miss these application windows">
          {upcomingDeadlines?.length === 0 ? (
            <EmptyState icon={FiClock} title="No upcoming deadlines" />
          ) : (
            <ul className="divide-y divide-gray-100">
              {upcomingDeadlines.map((job) => (
                <li key={job._id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{job.jobRole}</p>
                    <p className="text-gray-500">{job.companyName}</p>
                  </div>
                  <span className="text-gray-600">{formatDate(job.lastDateToApply)} · {job.lastTimeToApply}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Applied Jobs" subtitle="Track the status of every application you've submitted">
        {appliedJobs?.length === 0 ? (
          <EmptyState
            icon={FiFileText}
            title="You haven't applied to any jobs yet"
            description="Browse job openings to get started."
          />
        ) : (
          <div className="space-y-3">
            {appliedJobs.map((app) => (
              <ApplicationStatusCard key={app._id} application={app} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentDashboard;
