const mongoose = require('mongoose');

const APPLICATION_STATUSES = [
  'Applied',
  'Shortlisted',
  'Interview Scheduled',
  'Rejected',
  'Selected',
];

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },

    appliedAt: { type: Date, default: Date.now },

    // Snapshots — capture the student's state AT THE TIME of applying, so
    // later profile edits (e.g. CGPA update) never retroactively change
    // what was true when the application was submitted.
    resumeSnapshot: {
      fileName: { type: String, required: true },
      filePath: { type: String, required: true },
    },
    cgpaSnapshot: { type: Number, required: true },

    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'Applied',
    },

    statusHistory: [
      {
        status: { type: String, enum: APPLICATION_STATUSES },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      },
    ],
  },
  { timestamps: true }
);

// A student can apply to a given job only once — enforced at the DB layer,
// not just in controller logic.
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ studentId: 1 });

module.exports = mongoose.model('Application', applicationSchema);
module.exports.APPLICATION_STATUSES = APPLICATION_STATUSES;
