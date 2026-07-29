const { body, param } = require('express-validator');
const { APPLICATION_STATUSES } = require('../models/Application');

const applyValidator = [body('jobId').isMongoId().withMessage('A valid job id is required')];

const jobIdParamValidator = [param('jobId').isMongoId().withMessage('Invalid job id')];

const applicationIdParamValidator = [param('id').isMongoId().withMessage('Invalid application id')];

const statusUpdateValidator = [
  body('status')
    .isIn(APPLICATION_STATUSES)
    .withMessage(`Status must be one of: ${APPLICATION_STATUSES.join(', ')}`),
];

module.exports = {
  applyValidator,
  jobIdParamValidator,
  applicationIdParamValidator,
  statusUpdateValidator,
};
