const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Wrap upload_stream in a Promise for async/await usage
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'jobportal_profiles',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();
    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};


exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Wrap upload_stream in a Promise for async/await usage
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'jobportal_applications',
            resource_type: 'auto',
          },
          
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();
    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};
