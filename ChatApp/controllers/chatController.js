const ChatMessage = require('../models/chatModel');
const User = require('../models/userModel');
const { Sequelize, Op } = require('sequelize');

exports.storeMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.userId; 

        const chatMessage = await ChatMessage.create({ userId, message });

        res.status(201).json({ message: chatMessage.message });
    } catch (error) {
        res.status(500).json({ error: 'Failed to store message' });
    }
};
exports.getMessages = async (req, res) => {
    try {
        const lastId = req.query.lastId || 0;
        const messages = await ChatMessage.findAll({
            where: {
                id: {
                    [Sequelize.Op.gt]: lastId //  Fetch only messages with ID greater than lastId
                }
            }
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'name'] });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};