const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

// Routes protégées
router.use(auth);

router.post('/send', messageController.sendMessage);
router.get('/conversations', messageController.getConversations);
router.get('/unread-count', messageController.getUnreadCount);
router.get('/conversation/:userId', messageController.getConversation);
router.put('/read/:senderId', messageController.markAsRead);

module.exports = router;