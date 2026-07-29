import api from './api';

export const getAdminDashboard = async () => {
  const { data } = await api.get('/dashboard/admin');
  return data;
};

export const getStudentDashboard = async () => {
  const { data } = await api.get('/dashboard/student');
  return data;
};
