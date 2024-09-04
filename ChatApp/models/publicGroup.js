const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const PublicGroup = sequelize.define('PublicGroup', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

PublicGroup.belongsTo(User);  
User.hasMany(PublicGroup);    

module.exports = PublicGroup;
