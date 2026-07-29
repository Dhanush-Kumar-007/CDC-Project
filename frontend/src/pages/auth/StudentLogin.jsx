import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { loginStudent } from '../../services/authService';

const StudentLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      const res = await loginStudent(values);
      login(res.data.token, res.data.user, 'student');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Student Login"
      subtitle="Sign in to view job openings and track your applications"
      footer={
        <>
          New here?{' '}
          <Link to="/register" className="text-brand-700 font-medium hover:underline">
            Register as a student
          </Link>
          <div className="mt-2">
            <Link to="/admin/login" className="text-gray-400 hover:underline">
              CDC Admin login
            </Link>
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {serverError}
          </div>
        )}
        <Input
          label="Register Number or College Email"
          placeholder="21CS001 or you@college.edu"
          error={errors.identifier}
          {...register('identifier', { required: 'This field is required' })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password}
          {...register('password', { required: 'Password is required' })}
        />
        <Button type="submit" loading={submitting} className="w-full">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
};

export default StudentLogin;
