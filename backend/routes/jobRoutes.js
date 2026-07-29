const express = require('express');
const router = express.Router();

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  closeJob,
} = require('../controllers/jobController');
const { jobValidator } = require('../validators/jobValidators');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { uploadLogo } = require('../config/multer');
const parseJsonFields = require('../middleware/parseJsonFields');

// Every job route requires a logged-in user; write operations are admin-only.
router.use(protect);

router.get('/', getJobs);
router.get('/:id', getJobById);

router.post(
  '/',
  requireRole('admin'),
  uploadLogo.single('companyLogo'),
  parseJsonFields(['eligibleDepartments', 'selectionProcess', 'requiredSkills']),
  jobValidator,
  validateRequest,
  createJob
);

router.put(
  '/:id',
  requireRole('admin'),
  uploadLogo.single('companyLogo'),
  parseJsonFields(['eligibleDepartments', 'selectionProcess', 'requiredSkills']),
  jobValidator,
  validateRequest,
  updateJob
);

router.delete('/:id', requireRole('admin'), deleteJob);
router.patch('/:id/close', requireRole('admin'), closeJob);

module.exports = router;
