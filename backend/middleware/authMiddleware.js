const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const { error } = require('../utils/apiResponse');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

/**
 * Verifies the Bearer token, loads the corresponding user (Student or
 * Admin, based on the role embedded in the token), and attaches it to
 * req.user + req.userRole. Downstream role checks use req.userRole —
 * never trust a role claimed by the client outside the signed token.
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return error(res, { statusCode: 401, message: 'Not authorized, no token provided' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return error(res, { statusCode: 401, message: 'Not authorized, invalid or expired token' });
  }

  const Model = decoded.role === 'admin' ? Admin : Student;
  const user = await Model.findById(decoded.id);

  if (!user) {
    return error(res, { statusCode: 401, message: 'Not authorized, user no longer exists' });
  }

  req.user = user;
  req.userRole = decoded.role;
  next();
});

module.exports = { protect };
