const express = require('express');
const router = express.Router();
const { getJobseekerDashboard } = require('../controllers/jobseeker.controller');
const { authenticateJobSeeker } = require('../middlewares/auth.middleware');

router.get('/dashboard', authenticateJobSeeker, getJobseekerDashboard);

module.exports = router;
