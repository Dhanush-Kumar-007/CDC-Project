const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, select: false }, // bcrypt hash
    role: { type: String, default: 'admin', immutable: true },
  },
  { timestamps: true }
);

// `unique: true` on the email field above already creates the index —
// no need for an explicit schema.index() call here.
// Admins are never created via a public API route — see utils/seedAdmin.js
// and README for how to provision the first CDC admin account.

adminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Admin', adminSchema);
