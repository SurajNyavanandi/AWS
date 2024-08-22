const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

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
        console.error('Error Signing Up User:', error);
        return res.status(500).json({ Error: 'Error Signing Up User' });
    }
};
