//controllers/admin.js
const User = require('../models/user');
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
exports.getAdminDashboard = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching staff and services' });
    }
};
