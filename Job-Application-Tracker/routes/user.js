const express = require('express');
const userController = require('../controllers/user');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/signup', userController.createUser);
router.post('/login', userController.createLogin);
router.post('/logout', verifyToken, userController.logout); 
router.get('/logged-in-users', userController.getLoggedInUsers); 
router.get('/profile', verifyToken, userController.getProfile);

module.exports = router;
