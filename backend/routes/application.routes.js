const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { auth } = require('../middlewares/auth.middleware');
const uploadResume = require('../middlewares/uploadResume');

router.post(
  '/apply/:jobId',
  auth,
  uploadResume.single('resume'),
  applicationController.applyToJob
);

router.get('/', auth, applicationController.getApplications);
router.get('/my', auth, applicationController.getUserApplications);
router.post('/flag-application',auth, applicationController.getJobsWithAppliedFlag);

module.exports = router;
