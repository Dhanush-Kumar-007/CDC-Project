import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';
import { DEPARTMENTS, GENDERS, YEARS } from '../../utils/constants';
import { emailRule, phoneRule, percentageRule, cgpaRule } from '../../utils/validators';
import { updateMyProfile } from '../../services/studentService';

const splitList = (value) =>
  (value || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

const ProfileForm = ({ profile, onUpdated }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!profile) return;
    reset({
      fullName: profile.fullName,
      personalEmail: profile.personalEmail,
      phone: profile.phone,
      department: profile.department,
      section: profile.section,
      year: profile.year,
      activeArrears: profile.activeArrears,
      gender: profile.gender,
      tenthPercentage: profile.academics?.tenthPercentage,
      twelfthPercentage: profile.academics?.twelfthPercentage,
      diplomaPercentage: profile.academics?.diplomaPercentage,
      currentCgpa: profile.academics?.currentCgpa,
      technicalSkills: profile.skills?.technicalSkills?.join(', '),
      programmingLanguages: profile.skills?.programmingLanguages?.join(', '),
      certifications: profile.skills?.certifications?.join(', '),
    });
  }, [profile, reset]);

  const onSubmit = async (values) => {
    setMessage('');
    setServerError('');
    setSubmitting(true);
    try {
      const payload = {
        fullName: values.fullName,
        personalEmail: values.personalEmail,
        phone: values.phone,
        department: values.department,
        section: values.section,
        year: values.year,
        activeArrears: values.activeArrears,
        gender: values.gender,
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
        },
      };
      const res = await updateMyProfile(payload);
      onUpdated?.(res.data);
      setMessage('Profile updated successfully');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {message && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          {message}
        </div>
      )}
      {serverError && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {serverError}
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" error={errors.fullName} {...register('fullName', { required: 'Required' })} />
          <Input label="Personal Email" type="email" error={errors.personalEmail} {...register('personalEmail', emailRule)} />
          <Input label="Phone Number" error={errors.phone} {...register('phone', phoneRule)} />
          <Input as="select" label="Department" error={errors.department} {...register('department', { required: 'Required' })}>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Input>
          <Input label="Section" error={errors.section} {...register('section', { required: 'Required' })} />
          <Input as="select" label="Year" error={errors.year} {...register('year', { required: 'Required' })}>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Input>
          <Input label="Active Arrears" type="number" min="0" error={errors.activeArrears} {...register('activeArrears', { required: 'Required', min: 0 })} />
          <Input as="select" label="Gender" error={errors.gender} {...register('gender', { required: 'Required' })}>
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </Input>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Academic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="10th Percentage" type="number" step="0.01" error={errors.tenthPercentage} {...register('tenthPercentage', percentageRule('10th percentage'))} />
          <Input label="12th Percentage" type="number" step="0.01" error={errors.twelfthPercentage} {...register('twelfthPercentage', percentageRule('12th percentage'))} />
          <Input label="Diploma Percentage (optional)" type="number" step="0.01" {...register('diplomaPercentage')} />
          <Input label="Current CGPA" type="number" step="0.01" error={errors.currentCgpa} {...register('currentCgpa', cgpaRule('Current CGPA'))} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Skills</h3>
        <div className="grid grid-cols-1 gap-4">
          <Input label="Technical Skills" hint="Comma-separated" {...register('technicalSkills')} />
          <Input label="Programming Languages" hint="Comma-separated" {...register('programmingLanguages')} />
          <Input label="Certifications" hint="Comma-separated" {...register('certifications')} />
        </div>
      </div>

      <Button type="submit" loading={submitting} disabled={!isDirty}>
        Save Changes
      </Button>
    </form>
  );
};

export default ProfileForm;
