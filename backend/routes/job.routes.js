const express = require('express');
const router = express.Router();
const jobCtrl = require('../controllers/job.controller');
const { auth, restrictTo } = require('../middlewares/auth.middleware');

// Public
router.get('/', jobCtrl.getAllJobs);
router.get('/:id', jobCtrl.getJobById);

// Protected for employers
router.post('/', auth, restrictTo('employer'), jobCtrl.createJob);
router.put('/:id', auth, restrictTo('employer'), jobCtrl.updateJob);
router.delete('/:id', auth, restrictTo('employer'), jobCtrl.deleteJob);

module.exports = router;
