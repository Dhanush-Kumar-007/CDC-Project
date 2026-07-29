// Keeps every endpoint's response shape consistent: { success, message, data }
// for success responses and { success, message, errors? } for errors.

const success = (res, { statusCode = 200, message = 'Success', data = null, meta } = {}) => {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
};

const error = (res, { statusCode = 500, message = 'Something went wrong', errors } = {}) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

module.exports = { success, error };
