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
router.put('/edit-recipe/:id', verifyToken, userController.editRecipe);
router.delete('/delete-recipe/:id', verifyToken, userController.deleteRecipe);
router.get('/manage-recipes', verifyToken, userController.manageRecipes);
router.get('/list-recipes', verifyToken, userController.listRecipes);
router.post('/add-to-favorites', verifyToken, userController.addToFavorites);
router.get('/favorites', verifyToken, userController.favorites);
router.post('/add-review', verifyToken, userController.addReview);  
router.get('/your-reviews', verifyToken, userController.getUserReviews);  
router.post('/follow', verifyToken, userController.followUser);
router.get('/following', verifyToken, userController.getFollowing);


module.exports = router;
