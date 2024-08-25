const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const Group = require('./groupModel');

const GroupUser = sequelize.define('GroupUser', {
    groupId: {
        type: DataTypes.INTEGER,
        references: {
            model: Group,
            key: 'id',
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        }
    },
});
User.belongsToMany(Group, { through: GroupUser });
Group.belongsToMany(User, { through: GroupUser });

module.exports = GroupUser;
