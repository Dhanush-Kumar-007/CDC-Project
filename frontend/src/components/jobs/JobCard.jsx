import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatDate';

const JobCard = ({ job }) => (
  <Link
    to={`/jobs/${job._id}`}
    className="block bg-white border border-gray-200 rounded-lg shadow-card p-5 hover:border-brand-300 transition-colors"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {job.companyLogo ? (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${job.companyLogo}`}
            alt={`${job.companyName} logo`}
            className="h-10 w-10 rounded object-contain border border-gray-100 shrink-0"
          />
        ) : (
          <div className="h-10 w-10 rounded bg-brand-50 text-brand-700 flex items-center justify-center font-semibold shrink-0">
            {job.companyName?.[0]}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{job.jobRole}</p>
          <p className="text-sm text-gray-500 truncate">{job.companyName}</p>
        </div>
      </div>
      <Badge status={job.effectiveStatus || job.status} />
    </div>

    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-500">
      <span className="flex items-center gap-1">
        <FiMapPin size={14} /> {job.location}
      </span>
      <span className="flex items-center gap-1">
        <FiCalendar size={14} /> Apply by {formatDate(job.lastDateToApply)}
      </span>
      <span className="flex items-center gap-1">
        <FiClock size={14} /> {job.lastTimeToApply}
      </span>
    </div>

    <div className="mt-3 flex flex-wrap gap-2">
      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{job.jobType}</span>
      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{job.salaryPackage}</span>
    </div>
  </Link>
);

export default JobCard;
