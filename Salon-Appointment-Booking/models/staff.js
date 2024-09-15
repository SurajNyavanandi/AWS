//models/staff.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Staff = sequelize.define('Staff', {
    id: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
    name: {type: DataTypes.STRING,allowNull: false},
    specialization: {type: DataTypes.STRING,allowNull: true},
    available: {type: DataTypes.BOOLEAN,defaultValue: true}
});

module.exports = Staff;
