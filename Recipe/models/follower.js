// models/follower.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Follower = sequelize.define('Follower', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    follower_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: 'Users', key: 'id' } 
    },
    followed_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: 'Users', key: 'id' } 
    }
});

module.exports = Follower;
