const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadProfileImage, uploadResume } = require('../controllers/cloudinary.controller');

// Use memory storage
const upload = multer(); 

router.post('/profile-image', upload.single('image'), uploadProfileImage);

// For cover letter or resume upload
router.post('/application-files', upload.single('file'), uploadResume);

module.exports = router;
