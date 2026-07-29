import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';
import { DEPARTMENTS, JOB_TYPES, JOB_STATUSES } from '../../utils/constants';

const splitList = (value) =>
  (value || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

const toDateInputValue = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const JobForm = ({ initialJob, onSubmit, submitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eligibleDepartments: [],
      status: 'Draft',
    },
  });
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (!initialJob) return;
    reset({
      companyName: initialJob.companyName,
      jobRole: initialJob.jobRole,
      jobDescription: initialJob.jobDescription,
      salaryPackage: initialJob.salaryPackage,
      location: initialJob.location,
      jobType: initialJob.jobType,
      eligibleDepartments: initialJob.eligibleDepartments || [],
      minCgpa: initialJob.minCgpa,
      maxArrearsAllowed: initialJob.maxArrearsAllowed,
      lastDateToApply: toDateInputValue(initialJob.lastDateToApply),
      lastTimeToApply: initialJob.lastTimeToApply,
      driveDate: toDateInputValue(initialJob.driveDate),
      selectionProcess: initialJob.selectionProcess?.join(', '),
      requiredSkills: initialJob.requiredSkills?.join(', '),
      status: initialJob.status,
    });
  }, [initialJob, reset]);

  const submit = (values) => {
    const payload = {
      ...values,
      eligibleDepartments: values.eligibleDepartments,
      selectionProcess: splitList(values.selectionProcess),
      requiredSkills: splitList(values.requiredSkills),
    };
    onSubmit(payload, logoFile);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Company Name" error={errors.companyName} {...register('companyName', { required: 'Required' })} />
        <Input label="Job Role" error={errors.jobRole} {...register('jobRole', { required: 'Required' })} />
        <Input label="Salary Package" placeholder="e.g. 6.5 LPA" error={errors.salaryPackage} {...register('salaryPackage', { required: 'Required' })} />
        <Input label="Location" error={errors.location} {...register('location', { required: 'Required' })} />
        <Input as="select" label="Job Type" error={errors.jobType} {...register('jobType', { required: 'Required' })}>
          <option value="">Select job type</option>
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Input>
        <Input as="select" label="Status" error={errors.status} {...register('status', { required: 'Required' })}>
          {JOB_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Input>
      </div>

      <Input
        as="textarea"
        rows={5}
        label="Job Description"
        error={errors.jobDescription}
        {...register('jobDescription', { required: 'Required' })}
      />

      <div>
        <span className="form-label">Eligible Departments</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-gray-200 rounded-md p-3">
          {DEPARTMENTS.map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" value={d} {...register('eligibleDepartments', { required: 'Select at least one department' })} />
              {d}
            </label>
          ))}
        </div>
        {errors.eligibleDepartments && <p className="form-error">{errors.eligibleDepartments.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Minimum CGPA" type="number" step="0.01" error={errors.minCgpa} {...register('minCgpa', { required: 'Required', min: 0, max: 10 })} />
        <Input label="Maximum Arrears Allowed" type="number" min="0" error={errors.maxArrearsAllowed} {...register('maxArrearsAllowed', { required: 'Required', min: 0 })} />
        <Input label="Last Date to Apply" type="date" error={errors.lastDateToApply} {...register('lastDateToApply', { required: 'Required' })} />
        <Input
          label="Last Time to Apply"
          type="time"
          hint="24-hour format"
          error={errors.lastTimeToApply}
          {...register('lastTimeToApply', {
            required: 'Required',
            pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Invalid time format' },
          })}
        />
        <Input label="Drive Date (optional)" type="date" {...register('driveDate')} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Input label="Selection Process" hint="Comma-separated, e.g. Aptitude Test, Technical Interview, HR" {...register('selectionProcess')} />
        <Input label="Required Skills" hint="Comma-separated" {...register('requiredSkills')} />
      </div>

      <div>
        <span className="form-label">Company Logo (optional)</span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          className="block text-sm text-gray-500"
        />
      </div>

      <Button type="submit" loading={submitting}>
        {initialJob ? 'Save Changes' : 'Create Job'}
      </Button>
    </form>
  );
};

export default JobForm;
