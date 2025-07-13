const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'jobconnect/resumes',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw' // handles non-images like PDF/DOC
  }
});

const upload = multer({ storage });

module.exports = upload;
