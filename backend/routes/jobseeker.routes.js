const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); 
const { getJobseekerDashboard, jobseekerProfile, updateProfile } = require('../controllers/jobseeker.controller');
const { authenticateJobSeeker, auth } = require('../middlewares/auth.middleware');

router.get('/dashboard', authenticateJobSeeker, getJobseekerDashboard);
router.get('/profile', auth, jobseekerProfile );
router.put("/profile", auth, upload.single("profilePic"), updateProfile);

module.exports = router;
