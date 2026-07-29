/**
 * multipart/form-data (used for registration and job creation, since both
 * accept a file upload alongside the rest of the fields) can only carry
 * flat string values. The frontend JSON.stringify()s nested fields like
 * `academics`, `skills`, and `eligibleDepartments` before sending; this
 * middleware parses them back into real objects/arrays so validators and
 * controllers can work with them normally.
 */
const parseJsonFields = (fields) => (req, res, next) => {
  fields.forEach((field) => {
    if (typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch {
        // Leave the raw string in place — the validator will reject the
        // malformed shape with a clear message rather than this middleware
        // silently failing.
      }
    }
  });
  next();
};

module.exports = parseJsonFields;
