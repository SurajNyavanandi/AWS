// models/following.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Following = sequelize.define('Following', {
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

module.exports = Following;
