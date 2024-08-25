const Group = require('../models/groupModel');
const GroupUser = require('../models/groupUserModel');

exports.createGroup = async (req, res) => {
    try {
        const { name, userIds } = req.body;
        const createdBy = req.userId;
        const group = await Group.create({ name, createdBy });

        // Add the creator to the group
        await GroupUser.create({ groupId: group.id, userId: createdBy });

        // Add other users to the group
        if (userIds && userIds.length > 0) {
            const groupUsers = userIds.map(userId => ({ groupId: group.id, userId }));
            await GroupUser.bulkCreate(groupUsers);
        }

        res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create group' });
    }
};

exports.getUserGroups = async (req, res) => {
    try {
        const userId = req.userId;
        const groups = await Group.findAll({
            include: {
                model: GroupUser,
                where: { userId },
                attributes: []
            }
        });
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
};
