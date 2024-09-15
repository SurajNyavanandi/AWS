// models/appointment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Service = require('./service');
const Staff = require('./staff');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'canceled'),
        defaultValue: 'pending'
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid'),
        defaultValue: 'pending'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Services',
            key: 'id'
        }
    },
    staffId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Staff',
            key: 'id'
        }
    }
});

// Associations
User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

Service.hasMany(Appointment, { foreignKey: 'serviceId' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId' });

Staff.hasMany(Appointment, { foreignKey: 'staffId' });
Appointment.belongsTo(Staff, { foreignKey: 'staffId' });

module.exports = Appointment;

