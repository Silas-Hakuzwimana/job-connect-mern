const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadProfileImage } = require('../controllers/cloudinary.controller');

const upload = multer(); // Use memory storage

router.post('/profile-image', upload.single('image'), uploadProfileImage);

module.exports = router;
