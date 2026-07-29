import { STATUS_BADGE_STYLES } from '../../utils/constants';

const Badge = ({ status, className = '' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${STATUS_BADGE_STYLES[status] || 'bg-gray-100 text-gray-600 border-gray-200'} ${className}`}
  >
    {status}
  </span>
);

export default Badge;
