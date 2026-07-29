/**
 * Centralized error handler. Any error passed to next(err) — including
 * errors from asyncHandler-wrapped controllers — lands here.
 * Must be registered LAST, after all routes and after notFound.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  let statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  let message = err.message || 'Server error';

  // Malformed MongoDB ObjectId (e.g. bad :id in a route param)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate key (unique index violation) — e.g. race condition on
  // registerNumber/collegeEmail or the (studentId, jobId) application index
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists or violates a uniqueness rule` : 'Duplicate value';
  }

  // Mongoose schema validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Multer file-upload errors (size/type limits)
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
