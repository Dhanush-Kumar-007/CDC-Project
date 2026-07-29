const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');

/**
 * Attaches a live-computed `effectiveStatus` to the serialized job so a job
 * that has technically expired but hasn't been swept by the cron job yet
 * never shows as "Active" to a client. `status` remains the raw DB value;
 * `effectiveStatus` is what the UI should actually display/act on.
 */
const withEffectiveStatus = (job) => {
  const obj = job.toJSON();
  obj.effectiveStatus = job.computeEffectiveStatus();
  return obj;
};

// @desc    List jobs (students see only non-draft jobs; admins see everything, filterable)
// @route   GET /api/jobs
// @access  Private (student or admin)
const getJobs = asyncHandler(async (req, res) => {
  const { status, department, search, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (req.userRole !== 'admin') {
    filter.status = { $ne: 'Draft' };
  } else if (status) {
    filter.status = status;
  }

  if (department) filter.eligibleDepartments = department;
  if (search) filter.$text = { $search: search };

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Number(limit) || 20, 100);
  const skip = (pageNum - 1) * limitNum;

  const [jobs, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Job.countDocuments(filter),
  ]);

  return success(res, {
    message: 'Jobs fetched',
    data: jobs.map(withEffectiveStatus),
    meta: { total, page: pageNum, limit: limitNum },
  });
});

// @desc    Get single job by id
// @route   GET /api/jobs/:id
// @access  Private (student or admin)
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return error(res, { statusCode: 404, message: 'Job not found' });

  // Students should never be able to view a Draft job even via direct id.
  if (req.userRole !== 'admin' && job.status === 'Draft') {
    return error(res, { statusCode: 404, message: 'Job not found' });
  }

  return success(res, { message: 'Job fetched', data: withEffectiveStatus(job) });
});

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (admin)
const createJob = asyncHandler(async (req, res) => {
  const jobData = { ...req.body, createdBy: req.user._id };
  if (req.file) jobData.companyLogo = `/uploads/logos/${req.file.filename}`;

  const job = await Job.create(jobData);
  return success(res, { statusCode: 201, message: 'Job created', data: withEffectiveStatus(job) });
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (admin)
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return error(res, { statusCode: 404, message: 'Job not found' });

  Object.assign(job, req.body);
  if (req.file) job.companyLogo = `/uploads/logos/${req.file.filename}`;

  await job.save();
  return success(res, { message: 'Job updated', data: withEffectiveStatus(job) });
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (admin)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return error(res, { statusCode: 404, message: 'Job not found' });

  await job.deleteOne();
  return success(res, { message: 'Job deleted' });
});

// @desc    Manually close a job early (before its natural deadline)
// @route   PATCH /api/jobs/:id/close
// @access  Private (admin)
const closeJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return error(res, { statusCode: 404, message: 'Job not found' });

  job.status = 'Closed';
  await job.save();

  return success(res, { message: 'Job closed', data: withEffectiveStatus(job) });
});

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, closeJob };
