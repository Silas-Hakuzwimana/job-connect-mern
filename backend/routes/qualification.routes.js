const express = require('express');
const router = express.Router();
const qualificationController = require('../controllers/qualification.controller');
const { auth, authenticateJobSeeker,restrictTo } = require('../middlewares/auth.middleware');

router.post('/', auth, restrictTo('admin', 'employer','jobseeker'), qualificationController.createQualification);

router.post('/', auth, qualificationController.createQualification);
router.post('/save', auth, qualificationController.saveUserQualifications);
router.get('/', auth, qualificationController.getAllQualifications);
router.get('/me', auth, qualificationController.getUserQualifications);
router.get('/:id', auth, qualificationController.getQualificationById);
router.put('/:id', auth, qualificationController.updateQualification);
router.delete('/:id', auth, qualificationController.deleteQualification);

module.exports = router;
