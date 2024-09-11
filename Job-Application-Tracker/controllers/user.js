const User = require('../models/user');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');
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

        const { name, email, phone } = user;
        return res.status(200).json({ name, email, phone });
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching user profile' });
    }
};
exports.getLoggedInUsers = async (req, res) => {
    try {
        const onlineUsers = await User.findAll({ where: { isLoggedIn: true }, attributes: ['name', 'email'] });
        return res.status(200).json(onlineUsers);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching logged-in users' });
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

