import api from './api';

export const applyToJob = async (jobId) => {
  const { data } = await api.post('/applications/apply', { jobId });
  return data;
};

export const getMyApplications = async () => {
  const { data } = await api.get('/applications/my');
  return data;
};

export const getApplicantsForJob = async (jobId, params = {}) => {
  const { data } = await api.get(`/applications/job/${jobId}`, { params });
  return data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const { data } = await api.patch(`/applications/${applicationId}/status`, { status });
  return data;
};

/**
 * Triggers a browser download of the applicants CSV rather than returning
 * JSON — the backend streams `text/csv` with a Content-Disposition header.
 */
export const exportApplicantsCsv = async (jobId, jobLabel = 'applicants') => {
  const response = await api.get(`/applications/job/${jobId}/export`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${jobLabel.replace(/\s+/g, '_')}_applicants.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
