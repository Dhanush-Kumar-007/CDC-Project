const { error } = require('../utils/apiResponse');

/**
 * Usage: router.get('/admin-only', protect, requireRole('admin'), handler)
 * Must run AFTER protect (needs req.userRole to already be set from the
 * verified JWT — never from a client-supplied field).
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.userRole || !roles.includes(req.userRole)) {
    return error(res, { statusCode: 403, message: 'Forbidden: insufficient permissions' });
  }
  next();
};

module.exports = { requireRole };
