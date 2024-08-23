const express = require('express');
const chatController = require('../controllers/chatController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/send', verifyToken, chatController.storeMessage);
router.get('/messages', verifyToken, chatController.getMessages);

module.exports = router;
