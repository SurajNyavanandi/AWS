const Group = require('../models/group');
const User = require('../models/user');
const UserGroup = require('../models/userGroup');

exports.createGroup = async (req, res) => {
    const { name } = req.body;
    const adminId = req.userId;

    if (!name) {
        return res.status(400).json({ error: 'Group name is required' });
    }

    try {
        const newGroup = await Group.create({ name, adminId });
        await UserGroup.create({ userId: adminId, groupId: newGroup.id });

        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ error: 'Could not create group' });
    }
};

exports.addUserToGroup = async (req, res) => {
    const { email, groupId } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        await UserGroup.create({ userId: user.id, groupId });
        res.status(200).json({ message: 'User added to the group successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Could not add user to the group' });
    }
};

exports.getUserGroups = async (req, res) => {
    const userId = req.userId;

    try {
        const groups = await Group.findAll({
            include: [
                {
                    model: User,
                    through: {
                        where: { userId },
                    },
                    attributes: [],
                    required: true 
                }
            ]
        });

        if (groups.length === 0) {
            return res.status(200).json({ message: 'You are not part of any group' });
        }

        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve groups' });
    }
};

