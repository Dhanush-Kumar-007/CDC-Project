import Table from '../common/Table';
import Badge from '../common/Badge';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

const ApplicantTable = ({ applications, onStatusChange }) => {
  const resumeBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '');

  const columns = [
    { key: 'fullName', label: 'Student Name', render: (row) => row.studentId?.fullName },
    { key: 'registerNumber', label: 'Register No.', render: (row) => row.studentId?.registerNumber },
    { key: 'department', label: 'Department', render: (row) => row.studentId?.department },
    { key: 'cgpaSnapshot', label: 'CGPA', render: (row) => row.cgpaSnapshot },
    {
      key: 'resume',
      label: 'Resume',
      render: (row) => (
        <a
          href={`${resumeBaseUrl}${row.resumeSnapshot?.filePath}`}
          target="_blank"
          rel="noreferrer"
          className="text-brand-700 hover:underline"
        >
          View
        </a>
      ),
    },
    { key: 'appliedAt', label: 'Applied Date', render: (row) => formatDate(row.appliedAt) },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => onStatusChange(row._id, e.target.value)}
          className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'statusBadge',
      label: '',
      render: (row) => <Badge status={row.status} />,
    },
  ];

  return <Table columns={columns} data={applications} keyField="_id" emptyMessage="No applicants yet for this job" />;
};

export default ApplicantTable;
