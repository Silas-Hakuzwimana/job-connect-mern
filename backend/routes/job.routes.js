const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { auth, restrictTo } = require('../middlewares/auth.middleware');

// Public
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

router.get('/matched', auth, jobController.getJobsWithQualificationMatch);

router.get('/jobs', auth, jobController.getAllJobsWithQualificationStatus);

// Protected for employers
router.post('/', auth, restrictTo('employer'), jobController.createJob);
router.put('/:id', auth, restrictTo('employer'), jobController.updateJob);
router.delete('/:id', auth, restrictTo('employer'), jobController.deleteJob);

module.exports = router;
