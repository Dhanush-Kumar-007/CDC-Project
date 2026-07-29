const { body } = require('express-validator');

// registerNumber and collegeEmail are intentionally NOT editable here — they
// are the two unique identifiers used for login and must stay stable.
const updateProfileValidator = [
  body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
  body('personalEmail').optional().trim().isEmail().withMessage('Valid personal email is required'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone must be a 10-digit number'),
  body('section').optional().trim().notEmpty(),
  body('year').optional().isInt({ min: 1, max: 5 }),
  body('activeArrears').optional().isInt({ min: 0 }),
  body('academics.currentCgpa').optional().isFloat({ min: 0, max: 10 }),
  body('academics.tenthPercentage').optional().isFloat({ min: 0, max: 100 }),
  body('academics.twelfthPercentage').optional().isFloat({ min: 0, max: 100 }),
  body('academics.diplomaPercentage').optional({ nullable: true }).isFloat({ min: 0, max: 100 }),
  body('skills.technicalSkills').optional().isArray(),
  body('skills.programmingLanguages').optional().isArray(),
  body('skills.certifications').optional().isArray(),
  body('skills.projects').optional().isArray(),
];

const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  body('confirmNewPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

module.exports = { updateProfileValidator, changePasswordValidator };
