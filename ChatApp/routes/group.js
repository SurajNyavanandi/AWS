const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const groupController = require('../controllers/group');

router.post('/create', verifyToken, groupController.createGroup);
router.post('/add-user', verifyToken, groupController.addUserToGroup); 
router.get('/user-groups', verifyToken, groupController.getUserGroups); 

module.exports = router;
