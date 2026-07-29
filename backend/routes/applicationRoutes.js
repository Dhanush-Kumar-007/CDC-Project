const express = require('express');
const router = express.Router();

const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  exportApplicantsCsv,
} = require('../controllers/applicationController');
const {
  applyValidator,
  jobIdParamValidator,
  applicationIdParamValidator,
  statusUpdateValidator,
} = require('../validators/applicationValidators');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/apply', requireRole('student'), applyValidator, validateRequest, applyToJob);
router.get('/my', requireRole('student'), getMyApplications);

router.get(
  '/job/:jobId',
  requireRole('admin'),
  jobIdParamValidator,
  validateRequest,
  getApplicantsForJob
);
router.get(
  '/job/:jobId/export',
  requireRole('admin'),
  jobIdParamValidator,
  validateRequest,
  exportApplicantsCsv
);

router.patch(
  '/:id/status',
  requireRole('admin'),
  applicationIdParamValidator,
  statusUpdateValidator,
  validateRequest,
  updateApplicationStatus
);

module.exports = router;
