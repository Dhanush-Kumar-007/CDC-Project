import { useState } from 'react';
import Button from '../common/Button';
import { isJobDeadlinePassed } from '../../utils/formatDate';

/**
 * Disables itself and explains why when the job is closed/expired or the
 * student doesn't meet eligibility — purely a UX convenience. The backend
 * independently re-checks every one of these conditions at apply-time.
 */
const ApplyButton = ({ job, student, alreadyApplied, onApply }) => {
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');

  const deadlinePassed = isJobDeadlinePassed(job);
  const isClosed = job.effectiveStatus === 'Closed' || job.status === 'Closed' || deadlinePassed;
  const departmentEligible = job.eligibleDepartments?.includes(student?.department);
  const cgpaEligible = (student?.academics?.currentCgpa ?? 0) >= job.minCgpa;
  const arrearsEligible = (student?.activeArrears ?? 0) <= job.maxArrearsAllowed;
  const hasResume = !!student?.resume?.filePath;

  let disabledReason = '';
  if (alreadyApplied) disabledReason = 'You have already applied to this job';
  else if (isClosed) disabledReason = 'The application deadline has passed';
  else if (!departmentEligible) disabledReason = 'Your department is not eligible for this job';
  else if (!cgpaEligible) disabledReason = `Minimum CGPA required is ${job.minCgpa}`;
  else if (!arrearsEligible) disabledReason = `Maximum ${job.maxArrearsAllowed} active arrears allowed`;
  else if (!hasResume) disabledReason = 'Upload your resume in your profile before applying';

  const handleClick = async () => {
    setError('');
    setApplying(true);
    try {
      await onApply();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (alreadyApplied) {
    return <Button variant="secondary" disabled className="w-full">Already Applied</Button>;
  }

  return (
    <div>
      <Button
        onClick={handleClick}
        loading={applying}
        disabled={!!disabledReason}
        className="w-full"
      >
        Apply Now
      </Button>
      {disabledReason && <p className="text-xs text-gray-500 mt-2">{disabledReason}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default ApplyButton;
