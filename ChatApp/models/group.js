const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
});

Group.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });
User.hasMany(Group, { foreignKey: 'adminId' });

module.exports = Group;
