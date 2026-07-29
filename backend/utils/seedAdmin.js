// Run with: npm run seed:admin
// Provisions the first CDC admin account from SEED_ADMIN_* values in .env.
// There is intentionally no public admin registration endpoint — admin
// accounts must already exist in MongoDB, per the spec.

require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const run = async () => {
  await connectDB();

  const { SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = process.env;

  if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
    console.error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  const email = SEED_ADMIN_EMAIL.trim().toLowerCase();
  const existing = await Admin.findOne({ email });

  if (existing) {
    console.log(`Admin already exists: ${existing.email} — nothing to do.`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(SEED_ADMIN_PASSWORD, 12);

  const admin = await Admin.create({
    name: SEED_ADMIN_NAME || 'CDC Administrator',
    email,
    password: hashedPassword,
  });

  console.log(`Admin account created: ${admin.email}`);
  console.log('Remember to change/rotate SEED_ADMIN_PASSWORD in production.');
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed to seed admin:', err);
  process.exit(1);
});
