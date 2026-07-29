import { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import JobDetails from '../../components/jobs/JobDetails';
import ApplyButton from '../../components/jobs/ApplyButton';
import { useFetch } from '../../hooks/useFetch';
import { getJob } from '../../services/jobService';
import { getMyProfile } from '../../services/studentService';
import { getMyApplications, applyToJob } from '../../services/applicationService';

const JobDetailPage = () => {
  const { id } = useParams();

  const jobFetcher = useCallback(() => getJob(id), [id]);
  const profileFetcher = useCallback(() => getMyProfile(), []);
  const applicationsFetcher = useCallback(() => getMyApplications(), []);

  const { data: jobRes, loading: jobLoading, error: jobError } = useFetch(jobFetcher, [jobFetcher]);
  const { data: profileRes, loading: profileLoading } = useFetch(profileFetcher, [profileFetcher]);
  const { data: appsRes, loading: appsLoading, refetch: refetchApps } = useFetch(
    applicationsFetcher,
    [applicationsFetcher]
  );

  if (jobLoading || profileLoading || appsLoading) return <Spinner label="Loading job details…" />;
  if (jobError) return <p className="text-sm text-red-600">{jobError}</p>;

  const job = jobRes.data;
  const student = profileRes.data;
  const alreadyApplied = appsRes.data.some((app) => app.jobId?._id === job._id);

  return (
    <div className="space-y-6">
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
        <FiArrowLeft size={14} /> Back to job openings
      </Link>

      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="page-heading">{job.jobRole}</h2>
            <p className="text-gray-600 mt-1">{job.companyName} · {job.location}</p>
            <div className="mt-3">
              <Badge status={job.effectiveStatus || job.status} />
            </div>
          </div>
          <div className="w-56 shrink-0">
            <ApplyButton
              job={job}
              student={student}
              alreadyApplied={alreadyApplied}
              onApply={async () => {
                await applyToJob(job._id);
                await refetchApps();
              }}
            />
          </div>
        </div>
      </Card>

      <JobDetails job={job} />
    </div>
  );
};

export default JobDetailPage;
