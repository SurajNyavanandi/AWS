//routes/admin.js
const express = require('express');
const adminController = require('../controllers/admin');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', verifyToken, adminController.getAdminDashboard);
router.post('/switch-to-admin', verifyToken, adminController.switchToAdmin);
router.post('/switch-to-user', verifyToken, adminController.switchToUser);
router.post('/staff', verifyToken, adminController.createStaff);
router.put('/staff/:id', verifyToken, adminController.updateStaff);
router.delete('/staff/:id', verifyToken, adminController.deleteStaff);
router.post('/service', verifyToken, adminController.createService);
router.put('/service/:id', verifyToken, adminController.updateService);
router.delete('/service/:id', verifyToken, adminController.deleteService);
router.get('/services', adminController.getServices);
router.get('/available-staff', adminController.getAvailableStaff);

module.exports = router;
