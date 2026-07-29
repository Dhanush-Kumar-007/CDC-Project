const { Parser } = require('json2csv');

/**
 * Builds a CSV string from populated Application documents.
 * Expects each application's `studentId` to be populated with at least
 * fullName, registerNumber, department, collegeEmail, phone.
 */
const buildApplicantsCsv = (applications) => {
  const fields = [
    { label: 'Student Name', value: 'studentId.fullName' },
    { label: 'Register Number', value: 'studentId.registerNumber' },
    { label: 'Department', value: 'studentId.department' },
    { label: 'College Email', value: 'studentId.collegeEmail' },
    { label: 'Phone', value: 'studentId.phone' },
    { label: 'CGPA (at time of applying)', value: 'cgpaSnapshot' },
    { label: 'Applied Date', value: (row) => new Date(row.appliedAt).toLocaleString() },
    { label: 'Status', value: 'status' },
  ];

  const rows = applications.map((a) => (a.toObject ? a.toObject() : a));
  const parser = new Parser({ fields });
  return parser.parse(rows);
};

module.exports = { buildApplicantsCsv };
