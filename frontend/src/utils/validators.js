// These rules exist purely for immediate UX feedback via React Hook Form.
// They intentionally mirror backend/validators/*.js, but the backend
// re-validates everything independently — never trust the frontend alone.

export const required = (label) => ({ required: `${label} is required` });

export const emailRule = {
  required: 'Email is required',
  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
};

export const phoneRule = {
  required: 'Phone number is required',
  pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit phone number' },
};

export const passwordRule = {
  required: 'Password is required',
  minLength: { value: 8, message: 'Password must be at least 8 characters' },
};

export const percentageRule = (label) => ({
  required: `${label} is required`,
  min: { value: 0, message: `${label} cannot be negative` },
  max: { value: 100, message: `${label} cannot exceed 100` },
});

export const cgpaRule = (label = 'CGPA') => ({
  required: `${label} is required`,
  min: { value: 0, message: `${label} cannot be negative` },
  max: { value: 10, message: `${label} cannot exceed 10` },
});

export const timeRule = {
  required: 'Time is required',
  pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Use 24-hour HH:mm format' },
};
