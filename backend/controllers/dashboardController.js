const Student = require('../models/Student');
const Job = require('../models/Job');
const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

// @desc    Admin dashboard statistics
// @route   GET /api/dashboard/admin
// @access  Private (admin)
const getAdminStats = asyncHandler(async (req, res) => {
  const [studentCount, activeJobs, closedJobs, draftJobs, applicationCount, statusBreakdown] =
    await Promise.all([
      Student.countDocuments(),
      Job.countDocuments({ status: 'Active' }),
      Job.countDocuments({ status: 'Closed' }),
      Job.countDocuments({ status: 'Draft' }),
      Application.countDocuments(),
      Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

  return success(res, {
    message: 'Admin dashboard stats fetched',
    data: {
      studentCount,
      jobs: { active: activeJobs, closed: closedJobs, draft: draftJobs },
      applicationCount,
      applicationsByStatus: statusBreakdown.reduce(
        (acc, s) => ({ ...acc, [s._id]: s.count }),
        {}
      ),
    },
  });
});

// @desc    Student dashboard data (welcome, latest jobs, deadlines, applied jobs, profile completion)
// @route   GET /api/dashboard/student
// @access  Private (student)
const getStudentDashboard = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id);

  const [latestJobsRaw, upcomingDeadlinesRaw, appliedJobs] = await Promise.all([
    Job.find({ status: 'Active' }).sort({ createdAt: -1 }).limit(5),
    Job.find({ status: 'Active', lastDateToApply: { $gte: new Date() } })
      .sort({ lastDateToApply: 1 })
      .limit(5),
    Application.find({ studentId: req.user._id })
      .populate('jobId', 'companyName jobRole lastDateToApply lastTimeToApply status')
      .sort({ appliedAt: -1 }),
  ]);

  // Belt-and-suspenders: exclude anything that's technically expired even
  // if the cron sweep hasn't flipped its stored status yet.
  const latestJobs = latestJobsRaw.filter((j) => !j.isExpired());
  const upcomingDeadlines = upcomingDeadlinesRaw.filter((j) => !j.isExpired());

  return success(res, {
    message: 'Student dashboard data fetched',
    data: {
      welcomeName: student.fullName,
      profileCompletion: student.getProfileCompletion(),
      latestJobs,
      upcomingDeadlines,
      appliedJobs,
    },
  });
});

module.exports = { getAdminStats, getStudentDashboard };
