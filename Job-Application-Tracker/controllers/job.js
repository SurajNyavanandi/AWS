const Job = require('../models/job');
const sequelize = require('../config/database');
const Company = require('../models/company'); // Import the Company model

exports.createJob = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { title, description, experience, companyName, location, companyId } = req.body;
        const company = await Company.findByPk(companyId);

        if (!company) {
            return res.status(400).json({ error: 'Company not found' });
        }

        const job = await Job.create({ title, description, experience, companyName, location, companyId }, { transaction: t });
        await t.commit();
        return res.status(201).json({ job, message: 'Job created successfully' });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ error: 'Error creating job' });
    }
};


exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll();
        return res.status(200).json(jobs);
    } catch (error) {
        return res.status(500).json({ Error: 'Error fetching jobs' });
    }
};

exports.applyToJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.userId;
        return res.status(200).json({ message: 'Applied to job successfully' });
    } catch (error) {
        return res.status(500).json({ Error: 'Error applying to job' });
    }
};

exports.getAppliedJobs = async (req, res) => {
    try {
        const userId = req.userId;
        return res.status(200).json({ message: 'List of applied jobs' });
    } catch (error) {
        return res.status(500).json({ Error: 'Error fetching applied jobs' });
    }
};
