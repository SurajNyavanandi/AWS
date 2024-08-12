const express = require('express');
const passwordController = require('../controllers/passwordController');
const verifyToken=require('../middleware/authMiddleware');
const router = express.Router();

router.post('/forgotpassword', passwordController.forgotPassword);
router.post('/resetpassword/:id',verifyToken, passwordController.resetPassword); 

module.exports = router;
