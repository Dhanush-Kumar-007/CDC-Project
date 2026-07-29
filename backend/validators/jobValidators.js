const { body } = require('express-validator');
const { JOB_TYPES, JOB_STATUSES } = require('../models/Job');

const jobValidator = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('jobRole').trim().notEmpty().withMessage('Job role is required'),
  body('jobDescription').trim().notEmpty().withMessage('Job description is required'),
  body('salaryPackage').trim().notEmpty().withMessage('Salary package is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType').isIn(JOB_TYPES).withMessage(`Job type must be one of: ${JOB_TYPES.join(', ')}`),
  body('eligibleDepartments')
    .isArray({ min: 1 })
    .withMessage('At least one eligible department is required'),
  body('minCgpa').isFloat({ min: 0, max: 10 }).withMessage('Minimum CGPA must be between 0 and 10'),
  body('maxArrearsAllowed').isInt({ min: 0 }).withMessage('Max arrears allowed must be 0 or more'),
  body('lastDateToApply').isISO8601().withMessage('A valid last date to apply is required'),
  body('lastTimeToApply')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Last time to apply must be in 24-hour HH:mm format'),
  body('driveDate').optional({ nullable: true, checkFalsy: true }).isISO8601(),
  body('selectionProcess').optional().isArray(),
  body('requiredSkills').optional().isArray(),
  body('status').optional().isIn(JOB_STATUSES).withMessage(`Status must be one of: ${JOB_STATUSES.join(', ')}`),
];

module.exports = { jobValidator };
