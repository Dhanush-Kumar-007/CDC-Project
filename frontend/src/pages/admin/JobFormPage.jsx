import { useCallback, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import JobForm from '../../components/admin/JobForm';
import { useFetch } from '../../hooks/useFetch';
import { getJob, createJob, updateJob } from '../../services/jobService';

const JobFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const fetcher = useCallback(() => (isEdit ? getJob(id) : Promise.resolve(null)), [id, isEdit]);
  const { data, loading, error } = useFetch(fetcher, [fetcher]);

  const handleSubmit = async (values, logoFile) => {
    setServerError('');
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateJob(id, values, logoFile);
      } else {
        await createJob(values, logoFile);
      }
      navigate('/admin/jobs');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not save the job. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading) return <Spinner label="Loading job…" />;
  if (isEdit && error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <Link to="/admin/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
        <FiArrowLeft size={14} /> Back to manage jobs
      </Link>

      <div>
        <h2 className="page-heading">{isEdit ? 'Edit Job' : 'Post a New Job'}</h2>
        <p className="page-subheading">
          {isEdit ? 'Update the details of this job posting.' : 'Fill in the details below to publish a new job opening.'}
        </p>
      </div>

      {serverError && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{serverError}</div>
      )}

      <Card>
        <JobForm initialJob={isEdit ? data?.data : null} onSubmit={handleSubmit} submitting={submitting} />
      </Card>
    </div>
  );
};

export default JobFormPage;
