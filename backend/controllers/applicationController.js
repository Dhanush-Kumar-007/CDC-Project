const Job = require('../models/Job');
const Student = require('../models/Student');
const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');
const { buildApplicantsCsv } = require('../utils/csvExport');

// @desc    Apply to a job
// @route   POST /api/applications/apply
// @access  Private (student)
//
// Every check here is server-side and authoritative. The frontend may
// disable the Apply button for the same reasons, but that's UX only —
// this controller re-verifies everything regardless of what the client sent.
const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  const [job, student] = await Promise.all([
    Job.findById(jobId),
    Student.findById(req.user._id),
  ]);

  if (!job) return error(res, { statusCode: 404, message: 'Job not found' });

  if (job.status === 'Draft') {
    return error(res, { statusCode: 400, message: 'This job is not open for applications' });
  }
  if (job.status === 'Closed' || job.isExpired()) {
    return error(res, { statusCode: 400, message: 'The application deadline for this job has passed' });
  }
  if (!job.eligibleDepartments.includes(student.department)) {
    return error(res, { statusCode: 403, message: 'Your department is not eligible for this job' });
  }
  if (student.academics.currentCgpa < job.minCgpa) {
    return error(res, { statusCode: 403, message: `This job requires a minimum CGPA of ${job.minCgpa}` });
  }
  if (student.activeArrears > job.maxArrearsAllowed) {
    return error(res, {
      statusCode: 403,
      message: `This job allows a maximum of ${job.maxArrearsAllowed} active arrear(s)`,
    });
  }
  if (!student.resume?.filePath) {
    return error(res, { statusCode: 400, message: 'Please upload your resume before applying' });
  }

  const alreadyApplied = await Application.findOne({ studentId: student._id, jobId: job._id });
  if (alreadyApplied) {
    return error(res, { statusCode: 409, message: 'You have already applied to this job' });
  }

  // The unique (studentId, jobId) index on Application is the final backstop
  // against a race condition between the findOne check above and this create
  // (e.g. a double-click firing two near-simultaneous requests).
  const application = await Application.create({
    studentId: student._id,
    jobId: job._id,
    resumeSnapshot: { fileName: student.resume.fileName, filePath: student.resume.filePath },
    cgpaSnapshot: student.academics.currentCgpa,
    status: 'Applied',
    statusHistory: [{ status: 'Applied', changedAt: new Date() }],
  });

  return success(res, { statusCode: 201, message: 'Application submitted successfully', data: application });
});

// @desc    Get the logged-in student's own applications
// @route   GET /api/applications/my
// @access  Private (student)
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ studentId: req.user._id })
    .populate('jobId', 'companyName jobRole location salaryPackage status lastDateToApply lastTimeToApply')
    .sort({ appliedAt: -1 });

  return success(res, { message: 'Applications fetched', data: applications });
});

// @desc    Get all applicants for a job, with filters/search/sort
// @route   GET /api/applications/job/:jobId
// @access  Private (admin)
const getApplicantsForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const {
    department, minCgpa, maxCgpa, from, to, search,
    sortBy = 'appliedAt', order = 'desc',
  } = req.query;

  const job = await Job.findById(jobId);
  if (!job) return error(res, { statusCode: 404, message: 'Job not found' });

  const filter = { jobId };

  if (minCgpa || maxCgpa) {
    filter.cgpaSnapshot = {};
    if (minCgpa) filter.cgpaSnapshot.$gte = Number(minCgpa);
    if (maxCgpa) filter.cgpaSnapshot.$lte = Number(maxCgpa);
  }
  if (from || to) {
    filter.appliedAt = {};
    if (from) filter.appliedAt.$gte = new Date(from);
    if (to) filter.appliedAt.$lte = new Date(to);
  }

  const allowedSortFields = ['appliedAt', 'cgpaSnapshot', 'status'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'appliedAt';
  const sortDir = order === 'asc' ? 1 : -1;

  let applications = await Application.find(filter)
    .populate({
      path: 'studentId',
      select: 'fullName registerNumber department collegeEmail phone',
      ...(department ? { match: { department } } : {}),
    })
    .sort({ [sortField]: sortDir });

  // Mongoose's populate `match` leaves studentId as null for filtered-out
  // documents rather than removing them — strip those out here.
  applications = applications.filter((a) => a.studentId);

  if (search) {
    const term = search.toLowerCase();
    applications = applications.filter(
      (a) =>
        a.studentId.fullName.toLowerCase().includes(term) ||
        a.studentId.registerNumber.toLowerCase().includes(term)
    );
  }

  return success(res, { message: 'Applicants fetched', data: applications });
});

// @desc    Change an application's status
// @route   PATCH /api/applications/:id/status
// @access  Private (admin)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const application = await Application.findById(req.params.id);
  if (!application) return error(res, { statusCode: 404, message: 'Application not found' });

  application.status = status;
  application.statusHistory.push({ status, changedAt: new Date(), changedBy: req.user._id });
  await application.save();

  return success(res, { message: 'Application status updated', data: application });
});

// @desc    Export a job's applicant list as CSV
// @route   GET /api/applications/job/:jobId/export
// @access  Private (admin)
const exportApplicantsCsv = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) return error(res, { statusCode: 404, message: 'Job not found' });

  const applications = await Application.find({ jobId }).populate(
    'studentId',
    'fullName registerNumber department collegeEmail phone'
  );

  const validApplications = applications.filter((a) => a.studentId);
  const csv = buildApplicantsCsv(validApplications);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="applicants-${jobId}.csv"`);
  return res.status(200).send(csv);
});

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  exportApplicantsCsv,
};
