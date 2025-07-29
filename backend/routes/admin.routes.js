const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const {
  auth,
  restrictTo,
  verifyAdmin,
} = require('../middlewares/auth.middleware');

// All routes are protected + admin only
router.use(auth, verifyAdmin, restrictTo('admin'));

router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

router.get('/jobs', adminController.getAllJobs);
router.delete('/jobs/:id', adminController.deleteJob);

router.post('/jobs/:jobId/approve', adminController.approveJob);
router.post('/jobs/:jobId/reject', adminController.rejectJob);

router.get('/applications', adminController.getAllApplications);

router.get('/qualifications', adminController.getAllQualifications);
router.delete('/qualifications/:id', adminController.deleteQualification);

router.get('/dashboard-stats', adminController.getDashboardStats);

module.exports = router;
