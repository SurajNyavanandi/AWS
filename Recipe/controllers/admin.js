//controllers/admin.js
const User = require('../models/user');
const Recipe = require('../models/recipe');
const sequelize = require('../config/database');

exports.switchToAdmin = async (req, res) => {
    const userId = req.userId;
    const t = await sequelize.transaction();
    try {
        const user = await User.findByPk(userId, { transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ error: 'User not found' });
        }
        await user.update({ isAdmin: true }, { transaction: t });
        await t.commit();
        return res.status(200).json({ message: 'Switched to Admin role successfully' });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ error: 'Error switching to Admin role' });
    }
};
exports.switchToUser = async (req, res) => {
    const userId = req.userId;
    const t = await sequelize.transaction();
    try {
        const user = await User.findByPk(userId, { transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ error: 'User not found' });
        }
        await user.update({ isAdmin: false }, { transaction: t });
        await t.commit();
        return res.status(200).json({ message: 'Switched to User role successfully' });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ error: 'Error switching to User role' });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user.isAdmin) {
            return res.status(403).json({ error: 'Only admins can access this.' });
        }

        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching users.' });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user.isAdmin) {
            return res.status(403).json({ error: 'Only admins can delete users.' });
        }

        const userToDelete = await User.findByPk(req.params.id);
        if (!userToDelete) {
            return res.status(404).json({ error: 'User not found.' });
        }

        await userToDelete.destroy();
        return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting user.' });
    }
};
exports.getAllRecipes = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user.isAdmin) {
            return res.status(403).json({ error: 'Only admins can access this.' });
        }

        const recipes = await Recipe.findAll();
        return res.status(200).json(recipes);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching recipes.' });
    }
};
exports.deleteRecipe = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user.isAdmin) {
            return res.status(403).json({ error: 'Only admins can delete recipes.' });
        }

        const recipeToDelete = await Recipe.findByPk(req.params.id);
        if (!recipeToDelete) {
            return res.status(404).json({ error: 'Recipe not found.' });
        }

        await recipeToDelete.destroy();
        return res.status(200).json({ message: 'Recipe deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting recipe.' });
    }
};



