//controllers/admin.js
const User = require('../models/user');
const sequelize = require('../config/database');
const Staff = require('../models/staff');
const Service = require('../models/service');

exports.switchToAdmin = async (req, res) => {
    const userId = req.userId;
    const t = await sequelize.transaction();
    try {
        const user = await User.findByPk(userId, { transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ error: 'User not found' });
        }
        await user.update({ isAdmin: true }, { transaction: t });
        await t.commit();
        return res.status(200).json({ message: 'Switched to Admin role successfully' });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ error: 'Error switching to Admin role' });
    }
};
exports.switchToUser = async (req, res) => {
    const userId = req.userId;
    const t = await sequelize.transaction();
    try {
        const user = await User.findByPk(userId, { transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ error: 'User not found' });
        }
        await user.update({ isAdmin: false }, { transaction: t });
        await t.commit();
        return res.status(200).json({ message: 'Switched to User role successfully' });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ error: 'Error switching to User role' });
    }
};
exports.getAdminDashboard = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        const staff = await Staff.findAll();
        const services = await Service.findAll();
        return res.status(200).json({ staff, services });
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching staff and services' });
    }
};
exports.createStaff = async (req, res) => {
    const { name, specialization, available } = req.body;
    try {
        const newStaff = await Staff.create({ name, specialization, available });
        return res.status(201).json(newStaff);
    } catch (error) {
        return res.status(500).json({ error: 'Error creating staff' });
    }
};
exports.updateStaff = async (req, res) => {
    const { id } = req.params;
    const { name, specialization, available } = req.body;
    try {
        const staff = await Staff.findByPk(id);
        if (!staff) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        await staff.update({ name, specialization, available });
        return res.status(200).json(staff);
    } catch (error) {
        return res.status(500).json({ error: 'Error updating staff' });
    }
};
exports.deleteStaff = async (req, res) => {
    const { id } = req.params;
    try {
        const staff = await Staff.findByPk(id);
        if (!staff) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        await staff.destroy();
        return res.status(200).json({ message: 'Staff deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting staff' });
    }
};
exports.createService = async (req, res) => {
    const { name, description, duration, price } = req.body;
    try {
        const newService = await Service.create({ name, description, duration, price });
        return res.status(201).json(newService);
    } catch (error) {
        return res.status(500).json({ error: 'Error creating service' });
    }
};
exports.updateService = async (req, res) => {
    const { id } = req.params;
    const { name, description, duration, price } = req.body;
    try {
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        await service.update({ name, description, duration, price });
        return res.status(200).json(service);
    } catch (error) {
        return res.status(500).json({ error: 'Error updating service' });
    }
};
exports.deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        await service.destroy();
        return res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting service' });
    }
};
exports.getServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        return res.status(200).json(services);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching services' });
    }
};
exports.getAvailableStaff = async (req, res) => {
    try {
        const staff = await Staff.findAll({ where: { available: true } });
        return res.status(200).json(staff);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching available staff' });
    }
};
