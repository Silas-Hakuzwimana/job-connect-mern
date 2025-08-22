const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { auth, restrictTo } = require('../middlewares/auth.middleware');
const checkApprovedCompany = require('../middlewares/checkApprovedCompany');

// Public routes with specific fixed paths FIRST

router.get('/active-approved', jobController.getActiveApprovedJobs);
router.post('/flag-qualification', auth, jobController.flagJobsQualificationStatus);
router.get('/', jobController.getAllJobs);   // root listing route comes before dynamic id

// Dynamic route at the END (to avoid matching fixed routes accidentally)
router.get('/:id', jobController.getJobById);

// Protected routes for employers
router.post('/', auth, restrictTo('employer'),checkApprovedCompany, jobController.createJob);
router.put('/:id', auth, restrictTo('employer'), jobController.updateJob);
router.delete('/:id', auth, restrictTo('employer'), jobController.deleteJob);

module.exports = router;
