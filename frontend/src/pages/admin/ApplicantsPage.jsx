import { useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ApplicantFilters from '../../components/admin/ApplicantFilters';
import ApplicantTable from '../../components/admin/ApplicantTable';
import { useFetch } from '../../hooks/useFetch';
import { getJob } from '../../services/jobService';
import { getApplicantsForJob, updateApplicationStatus, exportApplicantsCsv } from '../../services/applicationService';

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [filters, setFilters] = useState({ sortBy: 'appliedAt' });
  const [exporting, setExporting] = useState(false);
  const [actionError, setActionError] = useState('');

  const jobFetcher = useCallback(() => getJob(jobId), [jobId]);
  const { data: jobRes, loading: jobLoading } = useFetch(jobFetcher, [jobFetcher]);

  const applicantsFetcher = useCallback(() => getApplicantsForJob(jobId, filters), [jobId, filters]);
  const { data: applicantsRes, loading: applicantsLoading, error, refetch } = useFetch(
    applicantsFetcher,
    [applicantsFetcher]
  );

  const handleStatusChange = async (applicationId, status) => {
    setActionError('');
    try {
      await updateApplicationStatus(applicationId, status);
      refetch();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not update status.');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportApplicantsCsv(jobId, jobRes?.data?.jobRole);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not export applicants.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
        <FiArrowLeft size={14} /> Back to manage jobs
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-heading">
            Applicants {jobLoading ? '' : `— ${jobRes?.data?.jobRole} at ${jobRes?.data?.companyName}`}
          </h2>
          <p className="page-subheading">Review, filter, and manage applications for this job.</p>
        </div>
        <Button variant="secondary" onClick={handleExport} loading={exporting}>
          <FiDownload /> Export CSV
        </Button>
      </div>

      {actionError && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{actionError}</div>
      )}

      <Card>
        <ApplicantFilters filters={filters} onChange={setFilters} />
      </Card>

      <Card>
        {applicantsLoading ? (
          <Spinner label="Loading applicants…" />
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <ApplicantTable applications={applicantsRes.data} onStatusChange={handleStatusChange} />
        )}
      </Card>
    </div>
  );
};

export default ApplicantsPage;
