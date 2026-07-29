import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { loginAdmin } from '../../services/authService';
import { emailRule } from '../../utils/validators';

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      const res = await loginAdmin(values);
      login(res.data.token, res.data.user, 'admin');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="CDC Admin Login"
      subtitle="Manage job postings and student applications"
      footer={
        <Link to="/login" className="text-gray-400 hover:underline">
          Student login
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {serverError}
          </div>
        )}
        <Input label="Email" placeholder="admin@college.edu" error={errors.email} {...register('email', emailRule)} />
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

export default AdminLogin;
