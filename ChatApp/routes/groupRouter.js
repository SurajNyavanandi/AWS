const express = require('express');
const groupController = require('../controllers/groupController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', verifyToken, groupController.createGroup);
router.get('/my-groups', verifyToken, groupController.getUserGroups);

module.exports = router;
