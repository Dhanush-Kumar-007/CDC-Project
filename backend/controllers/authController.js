const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');

// @desc    Register a new student (once only — registerNumber & collegeEmail must be unique)
// @route   POST /api/auth/student/register
// @access  Public
const registerStudent = asyncHandler(async (req, res) => {
  const {
    fullName, registerNumber, collegeEmail, personalEmail, phone,
    department, section, year, activeArrears, dob, gender,
    academics, skills, password,
  } = req.body;

  if (!req.file) {
    return error(res, { statusCode: 400, message: 'Resume PDF is required to complete registration' });
  }

  const normalizedRegNo = registerNumber.trim().toUpperCase();
  const normalizedEmail = collegeEmail.trim().toLowerCase();

  const existing = await Student.findOne({
    $or: [{ registerNumber: normalizedRegNo }, { collegeEmail: normalizedEmail }],
  });

  if (existing) {
    return error(res, {
      statusCode: 409,
      message:
        existing.registerNumber === normalizedRegNo
          ? 'A student with this register number is already registered'
          : 'A student with this college email is already registered',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const student = await Student.create({
    fullName,
    registerNumber: normalizedRegNo,
    collegeEmail: normalizedEmail,
    personalEmail,
    phone,
    department,
    section,
    year,
    activeArrears,
    dob,
    gender,
    academics,
    skills,
    resume: {
      fileName: req.file.originalname,
      filePath: `/uploads/resumes/${req.file.filename}`,
      uploadedAt: new Date(),
    },
    password: hashedPassword,
  });

  const token = generateToken({ id: student._id, role: 'student' });

  return success(res, {
    statusCode: 201,
    message: 'Registration successful',
    data: { token, user: student.toJSON() },
  });
});

// @desc    Student login using register number OR college email
// @route   POST /api/auth/student/login
// @access  Public
const loginStudent = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const normalized = identifier.trim();

  const student = await Student.findOne({
    $or: [{ registerNumber: normalized.toUpperCase() }, { collegeEmail: normalized.toLowerCase() }],
  }).select('+password');

  // Same generic message whether the user doesn't exist or the password is
  // wrong — never reveal which one it was.
  if (!student || !(await bcrypt.compare(password, student.password))) {
    return error(res, { statusCode: 401, message: 'Invalid credentials' });
  }

  const token = generateToken({ id: student._id, role: 'student' });

  return success(res, { message: 'Login successful', data: { token, user: student.toJSON() } });
});

// @desc    Admin login (no public registration — accounts are seeded/created in MongoDB)
// @route   POST /api/auth/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.trim().toLowerCase() }).select('+password');

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return error(res, { statusCode: 401, message: 'Invalid credentials' });
  }

  const token = generateToken({ id: admin._id, role: 'admin' });

  return success(res, { message: 'Login successful', data: { token, user: admin.toJSON() } });
});

module.exports = { registerStudent, loginStudent, loginAdmin };
