//routes/admin.js
const express = require('express');
const adminController = require('../controllers/admin');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/switch-to-admin', verifyToken, adminController.switchToAdmin);
router.post('/switch-to-user', verifyToken, adminController.switchToUser);
router.get('/users', verifyToken, adminController.getAllUsers);
router.delete('/delete-user/:id', verifyToken, adminController.deleteUser);
router.get('/recipes', verifyToken, adminController.getAllRecipes);
router.delete('/delete-recipe/:id', verifyToken, adminController.deleteRecipe);

module.exports = router;
