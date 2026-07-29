const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    link: { type: String, trim: true },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    // ---------------- Personal Information ----------------
    fullName: { type: String, required: true, trim: true },
    registerNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    collegeEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    personalEmail: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1, max: 5 },
    activeArrears: { type: Number, required: true, min: 0, default: 0 },
    dob: { type: Date, required: true },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    },

    // ---------------- Academic Information ----------------
    academics: {
      tenthPercentage: { type: Number, required: true, min: 0, max: 100 },
      twelfthPercentage: { type: Number, required: true, min: 0, max: 100 },
      diplomaPercentage: { type: Number, min: 0, max: 100 }, // optional
      currentCgpa: { type: Number, required: true, min: 0, max: 10 },
    },

    // ---------------- Skills ----------------
    skills: {
      technicalSkills: [{ type: String, trim: true }],
      programmingLanguages: [{ type: String, trim: true }],
      certifications: [{ type: String, trim: true }],
      projects: [projectSchema],
    },

    // ---------------- Documents ----------------
    resume: {
      fileName: { type: String },
      filePath: { type: String }, // relative path under /uploads/resumes
      uploadedAt: { type: Date },
    },

    // ---------------- Auth ----------------
    password: { type: String, required: true, select: false }, // bcrypt hash
    role: { type: String, default: 'student', immutable: true },
  },
  { timestamps: true }
);

/**
 * Profile completion percentage, used by the student dashboard widget.
 * Counts a fixed set of "meaningful" fields rather than every schema key,
 * so it reflects genuine profile readiness (e.g. resume + skills present).
 */
studentSchema.methods.getProfileCompletion = function () {
  const checks = [
    !!this.fullName,
    !!this.registerNumber,
    !!this.collegeEmail,
    !!this.personalEmail,
    !!this.phone,
    !!this.department,
    !!this.section,
    !!this.year,
    !!this.dob,
    !!this.gender,
    !!this.academics?.tenthPercentage,
    !!this.academics?.twelfthPercentage,
    !!this.academics?.currentCgpa,
    !!(this.skills?.technicalSkills?.length),
    !!(this.skills?.programmingLanguages?.length),
    !!this.resume?.filePath,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
};

// Never leak the password hash even if a route forgets to .select('-password')
studentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Student', studentSchema);
