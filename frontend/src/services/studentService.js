import api from './api';

export const getMyProfile = async () => {
  const { data } = await api.get('/students/profile');
  return data;
};

export const updateMyProfile = async (updates) => {
  const { data } = await api.put('/students/profile', updates);
  return data;
};

export const changeMyPassword = async (payload) => {
  const { data } = await api.put('/students/password', payload);
  return data;
};

export const uploadMyResume = async (resumeFile) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  const { data } = await api.post('/students/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
