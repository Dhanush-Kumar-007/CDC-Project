import Badge from '../common/Badge';
import Card from '../common/Card';
import { formatDate } from '../../utils/formatDate';

const JobDetails = ({ job }) => (
  <div className="space-y-6">
    <Card title="Job Description">
      <p className="text-sm text-gray-700 whitespace-pre-line">{job.jobDescription}</p>
    </Card>

    <Card title="Eligibility">
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-500">Eligible Departments</dt>
          <dd className="text-gray-900 mt-1">{job.eligibleDepartments?.join(', ')}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Minimum CGPA</dt>
          <dd className="text-gray-900 mt-1">{job.minCgpa}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Maximum Arrears Allowed</dt>
          <dd className="text-gray-900 mt-1">{job.maxArrearsAllowed}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Application Deadline</dt>
          <dd className="text-gray-900 mt-1">
            {formatDate(job.lastDateToApply)} at {job.lastTimeToApply}
          </dd>
        </div>
        {job.driveDate && (
          <div>
            <dt className="text-gray-500">Drive Date</dt>
            <dd className="text-gray-900 mt-1">{formatDate(job.driveDate)}</dd>
          </div>
        )}
        <div>
          <dt className="text-gray-500">Status</dt>
          <dd className="mt-1">
            <Badge status={job.effectiveStatus || job.status} />
          </dd>
        </div>
      </dl>
    </Card>

    {job.requiredSkills?.length > 0 && (
      <Card title="Required Skills">
        <div className="flex flex-wrap gap-2">
          {job.requiredSkills.map((skill) => (
            <span key={skill} className="text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </Card>
    )}

    {job.selectionProcess?.length > 0 && (
      <Card title="Selection Process">
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
          {job.selectionProcess.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Card>
    )}
  </div>
);

export default JobDetails;
