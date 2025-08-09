const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const {auth} = require('../middlewares/auth.middleware');

router.use(auth); // protect all notification routes

router.get('/', notificationController.getUserNotifications);
router.post('/create', auth, notificationController.createNotificationForUser);
router.patch('/:notificationId/read', notificationController.markAsRead);

module.exports = router;
