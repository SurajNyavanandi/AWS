const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const jwt=require('jsonwebtoken');

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
exports.createLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ Error: 'User not found' });
        }

        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            return res.status(401).json({ Error: 'Incorrect Password' });
        }

        const token = jwt.sign({ id: user.id }, 'secretchat@key');
        return res.status(200).json({ Message: 'Login Successful',token});

    } catch (error) {
        return res.status(500).json({ Error: 'Error creating login details' });
    }
}
