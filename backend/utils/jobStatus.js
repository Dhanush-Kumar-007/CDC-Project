const Job = require('../models/Job');

/**
 * Sweeps the DB for jobs whose stored status is still "Active" but whose
 * real deadline (date + time, via Job.isExpired()) has passed, and flips
 * them to "Closed".
 *
 * This is a performance/UX convenience only — it keeps dashboard counts
 * and job listings cheap to query without recomputing status on every
 * read. It is NOT the security boundary: applicationController always
 * re-checks job.isExpired() at the moment a student applies, regardless
 * of what this sweep has or hasn't updated yet.
 */
const closeExpiredJobs = async () => {
  const now = new Date();

  // Narrow candidates first (cheap index-backed query on lastDateToApply),
  // then apply the precise date+time check in memory since deadline is a
  // virtual that merges lastDateToApply with lastTimeToApply.
  const candidates = await Job.find({
    status: 'Active',
    lastDateToApply: { $lte: now },
  });

  const expiredIds = candidates.filter((job) => job.isExpired()).map((job) => job._id);

  if (expiredIds.length > 0) {
    await Job.updateMany({ _id: { $in: expiredIds } }, { $set: { status: 'Closed' } });
  }

  return expiredIds.length;
};

module.exports = { closeExpiredJobs };
