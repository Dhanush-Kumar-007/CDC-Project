const mongoose = require('mongoose');

const JOB_TYPES = ['Full-Time', 'Internship', 'Internship + PPO', 'Part-Time'];
const JOB_STATUSES = ['Draft', 'Active', 'Closed'];

const jobSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    companyLogo: { type: String, trim: true }, // relative path under /uploads/logos, optional

    jobRole: { type: String, required: true, trim: true },
    jobDescription: { type: String, required: true },

    salaryPackage: { type: String, required: true, trim: true }, // e.g. "6.5 LPA" — kept as string for ranges/stipends
    location: { type: String, required: true, trim: true },
    jobType: { type: String, required: true, enum: JOB_TYPES },

    eligibleDepartments: {
      type: [String],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    minCgpa: { type: Number, required: true, min: 0, max: 10 },
    maxArrearsAllowed: { type: Number, required: true, min: 0 },

    // Deadline is captured as separate date + time fields (per spec) but
    // exposed as a single merged JS Date via the `deadline` virtual below —
    // that virtual is the ONLY thing the rest of the app should compare `now` to.
    lastDateToApply: { type: Date, required: true },
    lastTimeToApply: {
      type: String, // "HH:mm" 24-hour format, e.g. "17:00"
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    driveDate: { type: Date },
    selectionProcess: { type: [String], default: [] }, // e.g. ["Aptitude Test", "Technical Interview", "HR"]
    requiredSkills: { type: [String], default: [] },

    status: { type: String, enum: JOB_STATUSES, default: 'Draft' },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Merge lastDateToApply + lastTimeToApply into one comparable Date.
jobSchema.virtual('deadline').get(function () {
  if (!this.lastDateToApply || !this.lastTimeToApply) return null;
  const [hours, minutes] = this.lastTimeToApply.split(':').map(Number);
  const merged = new Date(this.lastDateToApply);
  merged.setHours(hours, minutes, 0, 0);
  return merged;
});

/**
 * True if the application window has passed, regardless of what `status`
 * currently says in the DB. This is the authoritative check used by
 * applicationController before accepting an apply request.
 */
jobSchema.methods.isExpired = function () {
  const deadline = this.deadline;
  return deadline ? Date.now() > deadline.getTime() : false;
};

/**
 * The status that SHOULD be shown right now, combining the stored `status`
 * with the live deadline check. A Draft job never auto-activates; only
 * Active jobs can auto-close.
 */
jobSchema.methods.computeEffectiveStatus = function () {
  if (this.status === 'Draft') return 'Draft';
  if (this.status === 'Closed') return 'Closed';
  return this.isExpired() ? 'Closed' : 'Active';
};

jobSchema.index({ status: 1 });
jobSchema.index({ lastDateToApply: 1 });
jobSchema.index({ companyName: 'text', jobRole: 'text' });

module.exports = mongoose.model('Job', jobSchema);
module.exports.JOB_TYPES = JOB_TYPES;
module.exports.JOB_STATUSES = JOB_STATUSES;
