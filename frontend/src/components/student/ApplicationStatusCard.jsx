import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatDate';

const ApplicationStatusCard = ({ application }) => {
  const job = application.jobId;

  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white">
      <div className="min-w-0">
        <Link to={job?._id ? `/jobs/${job._id}` : '#'} className="font-medium text-gray-900 hover:text-brand-700 truncate block">
          {job?.jobRole || 'Job no longer available'}
        </Link>
        <p className="text-sm text-gray-500 truncate">{job?.companyName}</p>
        <p className="text-xs text-gray-400 mt-1">Applied on {formatDate(application.appliedAt)}</p>
      </div>
      <Badge status={application.status} />
    </div>
  );
};

export default ApplicationStatusCard;
