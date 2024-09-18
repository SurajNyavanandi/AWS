//routes/user.js
const express = require('express');
const userController = require('../controllers/user');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/signup', userController.createUser);
router.post('/login', userController.createLogin);
router.post('/logout', verifyToken, userController.logout); 
router.get('/profile', verifyToken, userController.getProfile);

router.post('/create-recipe', verifyToken, userController.createRecipe);
router.get('/manage-recipes', verifyToken, userController.manageRecipes);
router.get('/list-recipes', verifyToken, userController.listRecipes);
router.post('/search-recipes', verifyToken, userController.searchRecipes);
router.get('/favorites', verifyToken, userController.favorites);
router.get('/your-reviews', verifyToken, userController.yourReviews);
router.get('/reviews-to-recipes', verifyToken, userController.reviewsToRecipes);
router.get('/followers', verifyToken, userController.followers);
router.get('/following', verifyToken, userController.following);

module.exports = router;
