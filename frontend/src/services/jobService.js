import api from './api';

export const getJobs = async (params = {}) => {
  const { data } = await api.get('/jobs', { params });
  return data;
};

export const getJob = async (id) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
};

const buildJobFormData = (jobValues, logoFile) => {
  const formData = new FormData();
  const { eligibleDepartments, selectionProcess, requiredSkills, ...flatFields } = jobValues;

  Object.entries(flatFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') formData.append(key, value);
  });

  formData.append('eligibleDepartments', JSON.stringify(eligibleDepartments || []));
  formData.append('selectionProcess', JSON.stringify(selectionProcess || []));
  formData.append('requiredSkills', JSON.stringify(requiredSkills || []));

  if (logoFile) formData.append('companyLogo', logoFile);

  return formData;
};

export const createJob = async (jobValues, logoFile) => {
  const formData = buildJobFormData(jobValues, logoFile);
  const { data } = await api.post('/jobs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateJob = async (id, jobValues, logoFile) => {
  const formData = buildJobFormData(jobValues, logoFile);
  const { data } = await api.put(`/jobs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteJob = async (id) => {
  const { data } = await api.delete(`/jobs/${id}`);
  return data;
};

export const closeJob = async (id) => {
  const { data } = await api.patch(`/jobs/${id}/close`);
  return data;
};
