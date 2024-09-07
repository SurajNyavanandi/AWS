const cron = require('node-cron');
const { Op } = require('sequelize');
const PublicGroup = require('../models/publicGroup');
const ArchivedChat = require('../models/archivedChat');

// Run this cron job every night at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Archiving old messages...');

    try {
        // Move messages older than 1 day to ArchivedChat
        const result = await PublicGroup.findAll({
            where: {
                createdAt: {
                    [Op.lt]: new Date(new Date() - 24 * 60 * 60 * 1000) // 1 day old
                }
            }
        });

        if (result.length > 0) {
            const messagesToArchive = result.map(msg => ({
                id: msg.id,
                message: msg.message,
                createdAt: msg.createdAt,
                UserId: msg.UserId
            }));

            await ArchivedChat.bulkCreate(messagesToArchive);

            // Delete old messages from PublicGroup
            await PublicGroup.destroy({
                where: {
                    createdAt: {
                        [Op.lt]: new Date(new Date() - 24 * 60 * 60 * 1000) // 1 day old
                    }
                }
            });

            console.log('Old messages archived successfully.');
        } else {
            console.log('No old messages to archive.');
        }
    } catch (error) {
        console.error('Error archiving old messages:', error);
    }
});
