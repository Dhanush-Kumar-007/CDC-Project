import Input from '../common/Input';
import { DEPARTMENTS } from '../../utils/constants';

/**
 * Controlled filter bar — parent owns the filter state and passes it down
 * along with a single onChange(patch) updater.
 */
const ApplicantFilters = ({ filters, onChange }) => {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
      <Input
        label="Search"
        placeholder="Name or reg. no."
        value={filters.search || ''}
        onChange={set('search')}
        className="lg:col-span-2"
      />
      <Input as="select" label="Department" value={filters.department || ''} onChange={set('department')}>
        <option value="">All</option>
        {DEPARTMENTS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </Input>
      <Input label="Min CGPA" type="number" step="0.01" value={filters.minCgpa || ''} onChange={set('minCgpa')} />
      <Input label="Max CGPA" type="number" step="0.01" value={filters.maxCgpa || ''} onChange={set('maxCgpa')} />
      <Input as="select" label="Sort By" value={filters.sortBy || 'appliedAt'} onChange={set('sortBy')}>
        <option value="appliedAt">Applied Date</option>
        <option value="cgpaSnapshot">CGPA</option>
        <option value="status">Status</option>
      </Input>
    </div>
  );
};

export default ApplicantFilters;
