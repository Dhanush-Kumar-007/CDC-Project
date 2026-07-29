const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');

// Identity fields (registerNumber, collegeEmail) and password are
// intentionally excluded — they have their own dedicated flows.
const EDITABLE_FIELDS = [
  'fullName', 'personalEmail', 'phone', 'department', 'section',
  'year', 'activeArrears', 'dob', 'gender', 'academics', 'skills',
];

// @desc    Get the logged-in student's own profile
// @route   GET /api/students/profile
// @access  Private (student)
const getProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id);
  return success(res, {
    message: 'Profile fetched',
    data: { ...student.toJSON(), profileCompletion: student.getProfileCompletion() },
  });
});

// @desc    Update editable profile fields
// @route   PUT /api/students/profile
// @access  Private (student)
const updateProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id);

  EDITABLE_FIELDS.forEach((field) => {
    if (req.body[field] === undefined) return;

    if (field === 'academics' || field === 'skills') {
      // Merge rather than replace, so a partial update (e.g. just CGPA)
      // doesn't wipe out the rest of the nested object.
      const current = student[field]?.toObject ? student[field].toObject() : student[field] || {};
      student[field] = { ...current, ...req.body[field] };
    } else {
      student[field] = req.body[field];
    }
  });

  await student.save();

  return success(res, {
    message: 'Profile updated',
    data: { ...student.toJSON(), profileCompletion: student.getProfileCompletion() },
  });
});

// @desc    Change password
// @route   PUT /api/students/password
// @access  Private (student)
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const student = await Student.findById(req.user._id).select('+password');

  const match = await bcrypt.compare(currentPassword, student.password);
  if (!match) {
    return error(res, { statusCode: 401, message: 'Current password is incorrect' });
  }

  student.password = await bcrypt.hash(newPassword, 12);
  await student.save();

  return success(res, { message: 'Password updated successfully' });
});

// @desc    Upload/replace resume
// @route   POST /api/students/resume
// @access  Private (student)
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return error(res, { statusCode: 400, message: 'Resume PDF file is required' });
  }

  const student = await Student.findById(req.user._id);
  student.resume = {
    fileName: req.file.originalname,
    filePath: `/uploads/resumes/${req.file.filename}`,
    uploadedAt: new Date(),
  };
  await student.save();

  return success(res, { message: 'Resume uploaded successfully', data: { resume: student.resume } });
});

module.exports = { getProfile, updateProfile, changePassword, uploadResume };
