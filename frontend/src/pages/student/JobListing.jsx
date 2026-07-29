import { useCallback, useState } from 'react';
import { FiBriefcase } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import JobCard from '../../components/jobs/JobCard';
import { useFetch } from '../../hooks/useFetch';
import { getJobs } from '../../services/jobService';
import { DEPARTMENTS } from '../../utils/constants';

const JobListing = () => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');

  const fetcher = useCallback(() => getJobs({ search: search || undefined, department: department || undefined }), [search, department]);
  const { data, loading, error } = useFetch(fetcher, [fetcher]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-heading">Job Openings</h2>
        <p className="page-subheading">Browse and apply to opportunities posted by the CDC.</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Search"
            placeholder="Search by company or role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Input as="select" label="Department" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Input>
        </div>
      </Card>

      {loading ? (
        <Spinner label="Loading job openings…" />
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : data.data.length === 0 ? (
        <Card>
          <EmptyState icon={FiBriefcase} title="No jobs match your filters" description="Try a different search or clear the department filter." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.data.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListing;
