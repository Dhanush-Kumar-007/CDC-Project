export const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Computer Science Engineering (AI & ML)',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Mechatronics Engineering',
  'Electronics Engineering (VLSI Design and Technology)',
  'CSE (Cyber Security)',
  'Artificial Intelligence and Data Science',
  'Chemical Engineering',
  'Computer Science and Business Systems',
  'Information Technology',
  'Civil Engineering',
  'Biomedical Engineering',
];

export const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export const JOB_TYPES = ['Full-Time', 'Internship', 'Internship + PPO', 'Part-Time'];

export const JOB_STATUSES = ['Draft', 'Active', 'Closed'];

export const APPLICATION_STATUSES = [
  'Applied',
  'Shortlisted',
  'Interview Scheduled',
  'Rejected',
  'Selected',
];

// Badge color mapping — kept centralized so status colors stay consistent
// wherever a status pill is rendered (job cards, tables, dashboards).
export const STATUS_BADGE_STYLES = {
  Active: 'bg-green-50 text-green-700 border-green-200',
  Draft: 'bg-gray-100 text-gray-600 border-gray-200',
  Closed: 'bg-gray-100 text-gray-500 border-gray-200',
  Applied: 'bg-blue-50 text-blue-700 border-blue-200',
  Shortlisted: 'bg-amber-50 text-amber-700 border-amber-200',
  'Interview Scheduled': 'bg-purple-50 text-purple-700 border-purple-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  Selected: 'bg-green-50 text-green-700 border-green-200',
};

export const YEARS = [1, 2, 3, 4, 5];
