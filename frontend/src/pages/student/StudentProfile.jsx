import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ProfileForm from '../../components/student/ProfileForm';
import ResumeUpload from '../../components/student/ResumeUpload';
import ProfileCompletionMeter from '../../components/student/ProfileCompletionMeter';
import { useFetch } from '../../hooks/useFetch';
import { getMyProfile, changeMyPassword } from '../../services/studentService';
import { passwordRule } from '../../utils/validators';

const ChangePasswordForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const newPassword = watch('newPassword');

  const onSubmit = async (values) => {
    setMessage('');
    setServerError('');
    setSubmitting(true);
    try {
      await changeMyPassword(values);
      setMessage('Password updated successfully');
      reset();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not update password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {message && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">{message}</div>}
      {serverError && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{serverError}</div>}
      <Input label="Current Password" type="password" error={errors.currentPassword} {...register('currentPassword', { required: 'Required' })} />
      <Input label="New Password" type="password" error={errors.newPassword} {...register('newPassword', passwordRule)} />
      <Input
        label="Confirm New Password"
        type="password"
        error={errors.confirmNewPassword}
        {...register('confirmNewPassword', {
          required: 'Please confirm your new password',
          validate: (value) => value === newPassword || 'Passwords do not match',
        })}
      />
      <Button type="submit" loading={submitting}>Update Password</Button>
    </form>
  );
};

const StudentProfile = () => {
  const fetcher = useCallback(() => getMyProfile(), []);
  const { data, loading, error, refetch } = useFetch(fetcher, [fetcher]);

  if (loading) return <Spinner label="Loading your profile…" />;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const profile = data.data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-heading">My Profile</h2>
        <p className="page-subheading">Keep your details up to date for the best job matches.</p>
      </div>

      <Card>
        <ProfileCompletionMeter percentage={profile.profileCompletion} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Profile Details">
            <ProfileForm profile={profile} onUpdated={refetch} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Resume">
            <ResumeUpload resume={profile.resume} onUploaded={refetch} />
          </Card>

          <Card title="Change Password">
            <ChangePasswordForm />
          </Card>

          <Card title="Account Info" padded={false}>
            <dl className="divide-y divide-gray-100 text-sm">
              <div className="flex justify-between px-5 py-3">
                <dt className="text-gray-500">Register Number</dt>
                <dd className="text-gray-900 font-medium">{profile.registerNumber}</dd>
              </div>
              <div className="flex justify-between px-5 py-3">
                <dt className="text-gray-500">College Email</dt>
                <dd className="text-gray-900 font-medium">{profile.collegeEmail}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
