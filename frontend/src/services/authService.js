import api from './api';

/**
 * Registration is multipart/form-data because it includes the resume PDF.
 * Nested objects (academics, skills) are JSON.stringify'd — the backend's
 * parseJsonFields middleware parses them back into objects before validation.
 */
export const registerStudent = async (formValues, resumeFile) => {
  const formData = new FormData();

  const { academics, skills, ...flatFields } = formValues;

  Object.entries(flatFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });

  formData.append('academics', JSON.stringify(academics));
  formData.append('skills', JSON.stringify(skills || {}));
  formData.append('resume', resumeFile);

  const { data } = await api.post('/auth/student/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const loginStudent = async ({ identifier, password }) => {
  const { data } = await api.post('/auth/student/login', { identifier, password });
  return data;
};

export const loginAdmin = async ({ email, password }) => {
  const { data } = await api.post('/auth/admin/login', { email, password });
  return data;
};
