const jwt = require('jsonwebtoken');

/**
 * Signs a JWT for either a student or admin.
 * payload must include { id, role } — role drives role-based access
 * control in roleMiddleware.js and tells authMiddleware which model to
 * look the user up in.
 */
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

module.exports = generateToken;
