const express = require('express');
const router = express.Router();

const { getAdminStats, getStudentDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/admin', protect, requireRole('admin'), getAdminStats);
router.get('/student', protect, requireRole('student'), getStudentDashboard);

module.exports = router;
