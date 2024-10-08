const express = require('express');
const publicGroupController = require('../controllers/publicGroup');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/publicgroup', verifyToken, publicGroupController.sendMessage);
router.get('/publicgroup', verifyToken, publicGroupController.getMessages);
router.post('/upload', verifyToken, publicGroupController.uploadFile);
module.exports = router;
