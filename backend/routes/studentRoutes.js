const express = require('express');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
  uploadResume: uploadResumeCtrl,
} = require('../controllers/studentController');
const { updateProfileValidator, changePasswordValidator } = require('../validators/studentValidators');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { uploadResume } = require('../config/multer');
const parseJsonFields = require('../middleware/parseJsonFields');

router.use(protect, requireRole('student'));

router.get('/profile', getProfile);

router.put(
  '/profile',
  parseJsonFields(['academics', 'skills']),
  updateProfileValidator,
  validateRequest,
  updateProfile
);

router.put('/password', changePasswordValidator, validateRequest, changePassword);

router.post('/resume', uploadResume.single('resume'), uploadResumeCtrl);

module.exports = router;
