const express = require('express');
const router = express.Router();
const qualificationController = require('../controllers/qualification.controller');
const { auth, restrictTo } = require('../middlewares/auth.middleware');

router.post('/', auth, restrictTo('admin', 'employer'), qualificationController.createQualification);
router.get('/', auth, qualificationController.getAllQualifications);

module.exports = router;
