const ChatMessage = require('../models/chatModel');

exports.storeMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.userId; 

        const chatMessage = await ChatMessage.create({ userId, message });

        res.status(201).json({ message: chatMessage.message });
    } catch (error) {
        console.error('Error storing message:', error);
        res.status(500).json({ error: 'Failed to store message' });
    }
};
exports.getMessages = async (req, res) => {
    try {
        const messages = await ChatMessage.findAll();
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};