//controllers/user.js
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');
const { Favorite, Recipe, User,Review, Following} = require('../models'); 
require('dotenv').config();

exports.createUser = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, email, phone, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ Error: 'User already exists, Please Login' });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, phone, password: hashPassword }, { transaction: t });

        await t.commit();
        return res.status(201).json({ user, Message: 'Successfully Signed up' });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ Error: 'Error Signing Up User' });
    }
};
exports.createLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ Error: 'User not found' });
        }

        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            return res.status(401).json({ Error: 'Incorrect Password' });
        }

        await user.update({ isLoggedIn: true });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        return res.status(200).json({ Message: 'Login Successful', token });
    } catch (error) {
        return res.status(500).json({ Error: 'Error creating login details' });
    }
};
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user); 
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching user profile' });
    }
};
exports.logout = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.update({ isLoggedIn: false });
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        return res.status(500).json({ error: 'Error logging out' });
    }
};
exports.createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, cooking_time, servings } = req.body;
        
        const recipe = await Recipe.create({
            title,
            description,
            ingredients,
            instructions,
            cooking_time,
            servings,
            user_id: req.userId 
        });

        res.status(201).json({ message: 'Recipe created successfully', recipe });
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ message: 'Error creating recipe' });
    }
};
exports.manageRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({ where: { user_id: req.userId } });
        return res.status(200).json(recipes);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching recipes' });
    }
};
exports.editRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, cooking_time, servings } = req.body;

        const recipe = await Recipe.findByPk(id);
        if (!recipe || recipe.user_id !== req.userId) {
            return res.status(404).json({ error: 'Recipe not found or unauthorized' });
        }

        await recipe.update({ title, description, cooking_time, servings });
        return res.status(200).json({ message: 'Recipe updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error updating recipe' });
    }
};
exports.deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;

        const recipe = await Recipe.findByPk(id);
        if (!recipe || recipe.user_id !== req.userId) {
            return res.status(404).json({ error: 'Recipe not found or unauthorized' });
        }

        await recipe.destroy();
        return res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting recipe' });
    }
};
exports.listRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            include: {
                model: User,
                attributes: ['id','name']
            }
        });
        res.status(200).json({ recipes });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Failed to fetch recipes' });
    }
};
exports.addToFavorites = async (req, res) => {
    try {
        const userId = req.userId;
        const { recipeId } = req.body;

        const existingFavorite = await Favorite.findOne({ where: { user_id: userId, recipe_id: recipeId } });

        if (existingFavorite) {
            return res.status(400).json({ message: 'Recipe is already in your favorites.' });
        }

        await Favorite.create({ user_id: userId, recipe_id: recipeId });
        res.status(200).json({ message: 'Recipe added to favorites successfully.' });
    } catch (error) {
        console.error('Error adding recipe to favorites:', error);
        res.status(500).json({ error: 'An error occurred while adding to favorites.' });
    }
};
exports.favorites = async (req, res) => {
    try {
        const userId = req.userId;

        const favorites = await Favorite.findAll({ 
            where: { user_id: userId },
            include: [Recipe]
        });

        res.status(200).json({ favorites });
    } catch (error) {
        console.error('Error fetching favorite recipes:', error);
        res.status(500).json({ error: 'An error occurred while fetching favorites.' });
    }
};
exports.addReview = async (req, res) => {
    const { rating, comment, recipe_id } = req.body;
    const userId = req.userId;  

    try {
        const recipe = await Recipe.findByPk(recipe_id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }
        const review = await Review.create({
            rating,
            comment,
            recipe_id,
            user_id: userId
        });

        res.status(201).json({ message: 'Review added successfully!', review });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review.' });
    }
};
exports.getUserReviews = async (req, res) => {
    const userId = req.userId;  

    try {
        const reviews = await Review.findAll({
            where: { user_id: userId },
            include: [
                { model: Recipe, attributes: ['title'] }, 
                { model: User, attributes: ['name'] } 
            ]
        });

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found.' });
        }

        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews.' });
    }
};
exports.followUser = async (req, res) => {
    try {
        const followerId = req.userId;
        const followedId = req.body.userId;

        if (followerId === followedId) {
            return res.status(400).json({ message: "You can't follow yourself" });
        }

        const existingFollow = await Following.findOne({
            where: { follower_id: followerId, followed_id: followedId }
        });

        if (existingFollow) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        await Following.create({ follower_id: followerId, followed_id: followedId });
        res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
    }
};
exports.getFollowing = async (req, res) => { 
    try {
        const userId = req.userId;
        
        const followingList = await Following.findAll({
            where: { follower_id: userId },
            include: {
                model: User,
                as: 'Followed',
                attributes: ['name']
            }
        });

        const followedUsers = [];
        for (let i = 0; i < followingList.length; i++) {
            followedUsers.push(followingList[i].Followed.name);
        }

        res.status(200).json({ following: followedUsers });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve following users", error });
    }
};




