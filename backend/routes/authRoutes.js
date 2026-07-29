const express = require('express');
const router = express.Router();

const { registerStudent, loginStudent, loginAdmin } = require('../controllers/authController');
const {
  registerValidator,
  studentLoginValidator,
  adminLoginValidator,
} = require('../validators/authValidators');
const validateRequest = require('../middleware/validateRequest');
const parseJsonFields = require('../middleware/parseJsonFields');
const { uploadResume } = require('../config/multer');
const { authLimiter } = require('../middleware/rateLimiter');

// multipart/form-data: resume file + flattened fields (academics/skills sent as JSON strings)
router.post(
  '/student/register',
  authLimiter,
  uploadResume.single('resume'),
  parseJsonFields(['academics', 'skills']),
  registerValidator,
  validateRequest,
  registerStudent
);

router.post('/student/login', authLimiter, studentLoginValidator, validateRequest, loginStudent);

router.post('/admin/login', authLimiter, adminLoginValidator, validateRequest, loginAdmin);

module.exports = router;
