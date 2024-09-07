const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const ArchivedChat = sequelize.define('ArchivedChat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    }
});

ArchivedChat.belongsTo(User);
User.hasMany(ArchivedChat);

module.exports = ArchivedChat;
