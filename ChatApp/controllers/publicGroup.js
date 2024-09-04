const PublicGroup = require('../models/publicGroup');
const User = require('../models/user');
const sequelize = require('../config/database');

exports.sendMessage = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { message } = req.body;
        const userId = req.userId; 

        if (!message) {
            return res.status(400).json({ Error: 'Message content cannot be empty' });
        }
        const newMessage = await PublicGroup.create({
            message,
            UserId: userId
        }, { transaction: t });

        await t.commit();
        return res.status(201).json({ Message: 'Message sent successfully', newMessage });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ Error: 'Failed to send message' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await PublicGroup.findAll({
            include: [{ model: User, attributes: ['name'] }],
            order: [['createdAt', 'ASC']]
        });

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ Error: 'Failed to retrieve messages' });
    }
};
