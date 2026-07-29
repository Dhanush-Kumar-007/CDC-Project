import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { registerStudent } from '../../services/authService';
import { DEPARTMENTS, GENDERS, YEARS } from '../../utils/constants';
import { emailRule, phoneRule, passwordRule, percentageRule, cgpaRule } from '../../utils/validators';

// Splits a comma-separated input into a clean array of trimmed strings.
const splitList = (value) =>
  (value || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

const StudentRegister = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projects: [{ title: '', description: '', link: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'projects' });

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setResumeError('Resume must be a PDF file');
      setResumeFile(null);
      return;
    }
    setResumeError('');
    setResumeFile(file);
  };

  const onSubmit = async (values) => {
    if (!resumeFile) {
      setResumeError('Resume PDF is required');
      return;
    }
    setServerError('');
    setSubmitting(true);
    try {
      const payload = {
        fullName: values.fullName,
        registerNumber: values.registerNumber,
        collegeEmail: values.collegeEmail,
        personalEmail: values.personalEmail,
        phone: values.phone,
        department: values.department,
        section: values.section,
        year: values.year,
        activeArrears: values.activeArrears,
        dob: values.dob,
        gender: values.gender,
        password: values.password,
        confirmPassword: values.confirmPassword,
        academics: {
          tenthPercentage: values.tenthPercentage,
          twelfthPercentage: values.twelfthPercentage,
          diplomaPercentage: values.diplomaPercentage || undefined,
          currentCgpa: values.currentCgpa,
        },
        skills: {
          technicalSkills: splitList(values.technicalSkills),
          programmingLanguages: splitList(values.programmingLanguages),
          certifications: splitList(values.certifications),
          projects: (values.projects || []).filter((p) => p.title?.trim()),
        },
      };

      const res = await registerStudent(payload, resumeFile);
      login(res.data.token, res.data.user, 'student');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Student Registration"
      subtitle="One-time registration — you'll use these details to log in going forward"
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="text-brand-700 font-medium hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {serverError && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {serverError}
          </div>
        )}

        {/* Personal Information */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" error={errors.fullName} {...register('fullName', { required: 'Full name is required' })} />
            <Input label="Register Number" error={errors.registerNumber} {...register('registerNumber', { required: 'Register number is required' })} />
            <Input label="College Email" type="email" error={errors.collegeEmail} {...register('collegeEmail', emailRule)} />
            <Input label="Personal Email" type="email" error={errors.personalEmail} {...register('personalEmail', emailRule)} />
            <Input label="Phone Number" error={errors.phone} {...register('phone', phoneRule)} />
            <Input as="select" label="Department" error={errors.department} {...register('department', { required: 'Department is required' })}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Input>
            <Input label="Section" error={errors.section} {...register('section', { required: 'Section is required' })} />
            <Input as="select" label="Year" error={errors.year} {...register('year', { required: 'Year is required' })}>
              <option value="">Select year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Input>
            <Input
              label="Number of Active Arrears"
              type="number"
              min="0"
              error={errors.activeArrears}
              {...register('activeArrears', { required: 'Required', min: { value: 0, message: 'Cannot be negative' } })}
            />
            <Input label="Date of Birth" type="date" error={errors.dob} {...register('dob', { required: 'Date of birth is required' })} />
            <Input as="select" label="Gender" error={errors.gender} {...register('gender', { required: 'Gender is required' })}>
              <option value="">Select gender</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </Input>
          </div>
        </section>

        {/* Academic Information */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Academic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="10th Percentage" type="number" step="0.01" error={errors.tenthPercentage} {...register('tenthPercentage', percentageRule('10th percentage'))} />
            <Input label="12th Percentage" type="number" step="0.01" error={errors.twelfthPercentage} {...register('twelfthPercentage', percentageRule('12th percentage'))} />
            <Input label="Diploma Percentage (optional)" type="number" step="0.01" error={errors.diplomaPercentage} {...register('diplomaPercentage')} />
            <Input label="Current CGPA" type="number" step="0.01" error={errors.currentCgpa} {...register('currentCgpa', cgpaRule('Current CGPA'))} />
          </div>
        </section>

        {/* Skills */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Skills</h3>
          <div className="grid grid-cols-1 gap-4">
            <Input label="Technical Skills" hint="Comma-separated, e.g. React, Node.js, MongoDB" {...register('technicalSkills')} />
            <Input label="Programming Languages" hint="Comma-separated, e.g. Python, Java, C++" {...register('programmingLanguages')} />
            <Input label="Certifications" hint="Comma-separated" {...register('certifications')} />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="form-label mb-0">Projects</span>
              <button
                type="button"
                onClick={() => append({ title: '', description: '', link: '' })}
                className="text-sm text-brand-700 hover:underline inline-flex items-center gap-1"
              >
                <FiPlus size={14} /> Add project
              </button>
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-md p-3 relative">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                      aria-label="Remove project"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Title" {...register(`projects.${index}.title`)} />
                    <Input label="Link (optional)" {...register(`projects.${index}.link`)} />
                  </div>
                  <Input as="textarea" rows={2} label="Description" className="mt-3" {...register(`projects.${index}.description`)} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Documents */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Documents</h3>
          <label className="form-label">Resume (PDF)</label>
          <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-md px-3 py-3 text-sm text-gray-500 cursor-pointer hover:border-brand-400">
            <FiUpload />
            {resumeFile ? resumeFile.name : 'Click to upload your resume (PDF only)'}
            <input type="file" accept="application/pdf" onChange={handleResumeChange} className="hidden" />
          </label>
          {resumeError && <p className="form-error">{resumeError}</p>}
        </section>

        {/* Authentication */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Set a Password</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Password" type="password" error={errors.password} {...register('password', passwordRule)} />
            <Input
              label="Confirm Password"
              type="password"
              error={errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
          </div>
        </section>

        <Button type="submit" loading={submitting} className="w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
};

export default StudentRegister;
