//controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashPassword });
        await user.save();
        return res.status(201).json({ user, Message: 'SignUp Successful' });
    } catch (error) {
        return res.status(500).json({ Error: 'Error Signing Up User' });
    }
};

exports.createLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ Error: 'User does not exist' });
        }

        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            return res.status(400).json({ Error: 'Incorrect Password' });
        }

        const token = jwt.sign({ id: user._id, name: user.name, email: user.email, isPremium: user.isPremium }, 'secrect@key');
        return res.status(200).json({ Message: 'Login Successful', token, isPremium: user.isPremium });

    } catch (error) {
        return res.status(500).json({ Error: 'Error creating Login details' });
    }
};

