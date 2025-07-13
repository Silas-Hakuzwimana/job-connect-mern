const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);

//Password request routes

router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);


module.exports = router;
