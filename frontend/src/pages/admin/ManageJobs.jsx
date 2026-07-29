import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiXCircle, FiUsers } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { useFetch } from '../../hooks/useFetch';
import { getJobs, deleteJob, closeJob } from '../../services/jobService';
import { formatDate } from '../../utils/formatDate';

const ManageJobs = () => {
  const navigate = useNavigate();
  const fetcher = useCallback(() => getJobs({ limit: 100 }), []);
  const { data, loading, error, refetch } = useFetch(fetcher, [fetcher]);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleClose = async (id) => {
    setActionError('');
    try {
      await closeJob(id);
      refetch();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not close the job.');
    }
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    setBusy(true);
    try {
      await deleteJob(jobToDelete._id);
      setJobToDelete(null);
      refetch();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not delete the job.');
    } finally {
      setBusy(false);
    }
  };

  const columns = [
    { key: 'companyName', label: 'Company' },
    { key: 'jobRole', label: 'Role' },
    { key: 'jobType', label: 'Type' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge status={row.effectiveStatus || row.status} />,
    },
    { key: 'deadline', label: 'Deadline', render: (row) => `${formatDate(row.lastDateToApply)} · ${row.lastTimeToApply}` },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Link to={`/admin/jobs/${row._id}/applicants`} className="text-gray-500 hover:text-brand-700" title="View applicants">
            <FiUsers size={16} />
          </Link>
          <button onClick={() => navigate(`/admin/jobs/${row._id}/edit`)} className="text-gray-500 hover:text-brand-700" title="Edit">
            <FiEdit2 size={16} />
          </button>
          {row.effectiveStatus !== 'Closed' && row.status !== 'Closed' && (
            <button onClick={() => handleClose(row._id)} className="text-gray-500 hover:text-amber-600" title="Close job">
              <FiXCircle size={16} />
            </button>
          )}
          <button onClick={() => setJobToDelete(row)} className="text-gray-500 hover:text-red-600" title="Delete">
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-heading">Manage Jobs</h2>
          <p className="page-subheading">Create, edit, and monitor job postings.</p>
        </div>
        <Button onClick={() => navigate('/admin/jobs/new')}>
          <FiPlus /> New Job
        </Button>
      </div>

      {actionError && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{actionError}</div>
      )}

      <Card>
        {loading ? (
          <Spinner label="Loading jobs…" />
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <Table columns={columns} data={data.data} keyField="_id" emptyMessage="No jobs posted yet" />
        )}
      </Card>

      <Modal
        open={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        title="Delete Job"
        footer={
          <>
            <Button variant="secondary" onClick={() => setJobToDelete(null)}>Cancel</Button>
            <Button variant="danger" loading={busy} onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>{jobToDelete?.jobRole}</strong> at{' '}
          <strong>{jobToDelete?.companyName}</strong>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ManageJobs;
