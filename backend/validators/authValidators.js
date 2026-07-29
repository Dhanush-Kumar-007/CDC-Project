const { body } = require('express-validator');

const registerValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('registerNumber').trim().notEmpty().withMessage('Register number is required'),
  body('collegeEmail').trim().isEmail().withMessage('Valid college email is required'),
  body('personalEmail').trim().isEmail().withMessage('Valid personal email is required'),
  body('phone')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone must be a 10-digit number'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('section').trim().notEmpty().withMessage('Section is required'),
  body('year').isInt({ min: 1, max: 5 }).withMessage('Year must be between 1 and 5'),
  body('activeArrears').isInt({ min: 0 }).withMessage('Active arrears must be 0 or more'),
  body('dob').isISO8601().toDate().withMessage('Valid date of birth is required'),
  body('gender')
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say'])
    .withMessage('Invalid gender value'),

  body('academics.tenthPercentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('10th percentage must be between 0 and 100'),
  body('academics.twelfthPercentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('12th percentage must be between 0 and 100'),
  body('academics.diplomaPercentage')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0, max: 100 })
    .withMessage('Diploma percentage must be between 0 and 100'),
  body('academics.currentCgpa')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Current CGPA must be between 0 and 10'),

  body('skills.technicalSkills').optional().isArray().withMessage('Technical skills must be a list'),
  body('skills.programmingLanguages').optional().isArray().withMessage('Programming languages must be a list'),
  body('skills.certifications').optional().isArray().withMessage('Certifications must be a list'),
  body('skills.projects').optional().isArray().withMessage('Projects must be a list'),

  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

// Login accepts EITHER register number OR college email in `identifier`
const studentLoginValidator = [
  body('identifier').trim().notEmpty().withMessage('Register number or college email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const adminLoginValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidator, studentLoginValidator, adminLoginValidator };
