require('dotenv').config();

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const cron = require('node-cron');

const connectDB = require('./config/db');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { closeExpiredJobs } = require('./utils/jobStatus');

const app = express();

// ---------------------------------------------------------
// Database
// ---------------------------------------------------------
connectDB();

// ---------------------------------------------------------
// Core security & parsing middleware
// ---------------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // strips $ / . operators from user input to block NoSQL injection

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ---------------------------------------------------------
// Static file serving (resumes / logos)
// Directly serving from disk for now — swap this for S3/Cloudinary
// later without touching any controller logic.
// ---------------------------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------------------------------------------------
// Health check
// ---------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CDC Portal API is running', time: new Date().toISOString() });
});

// ---------------------------------------------------------
// API routes
// ---------------------------------------------------------
app.use('/api', apiLimiter);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// ---------------------------------------------------------
// 404 + centralized error handler (must be last)
// ---------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------------
// Auto-close expired jobs every 5 minutes.
// This is a dashboard/listing performance convenience only — the
// authoritative deadline check always happens again at apply-time in
// applicationController regardless of whether this sweep has run yet.
// ---------------------------------------------------------
cron.schedule('*/5 * * * *', async () => {
  try {
    const closedCount = await closeExpiredJobs();
    if (closedCount > 0) {
      console.log(`Auto-closed ${closedCount} expired job(s)`);
    }
  } catch (err) {
    console.error('Error auto-closing expired jobs:', err.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CDC Portal API listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app;
