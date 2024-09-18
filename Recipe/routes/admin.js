//routes/admin.js
const express = require('express');
const adminController = require('../controllers/admin');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', verifyToken, adminController.getAdminDashboard);
router.post('/switch-to-admin', verifyToken, adminController.switchToAdmin);
router.post('/switch-to-user', verifyToken, adminController.switchToUser);

module.exports = router;
