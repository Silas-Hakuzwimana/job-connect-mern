const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth, restrictTo } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const upload = require('../middlewares/uploadCloudinary');

// Admin only routes
router.get('/', auth, restrictTo('admin'), userController.getAllUsers);
router.delete('/:id', auth, restrictTo('admin'), userController.deleteUser);

// Admin or self routes
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);

router.post('/upload-profile-pic', auth, upload.single('profilePic'), userController.uploadProfilePic);

module.exports = router;
