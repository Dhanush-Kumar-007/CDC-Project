export const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Merges a job's lastDateToApply + lastTimeToApply into a single Date,
 * mirroring the backend's `deadline` virtual on the Job model, so the
 * frontend's own "is this expired?" checks stay consistent with the server.
 * This is used ONLY for UI hints (disabling buttons, showing countdowns) —
 * the backend re-verifies the deadline independently on every apply request.
 */
export const getJobDeadline = (job) => {
  if (!job?.lastDateToApply || !job?.lastTimeToApply) return null;
  const [hours, minutes] = job.lastTimeToApply.split(':').map(Number);
  const deadline = new Date(job.lastDateToApply);
  deadline.setHours(hours, minutes, 0, 0);
  return deadline;
};

export const isJobDeadlinePassed = (job) => {
  const deadline = getJobDeadline(job);
  return deadline ? Date.now() > deadline.getTime() : false;
};
