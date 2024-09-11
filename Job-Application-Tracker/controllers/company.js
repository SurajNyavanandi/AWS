const Company = require('../models/company');

exports.createCompany = async (req, res) => {
    try {
        const { name, location, numberOfEmployees, description } = req.body;

        const company = await Company.create({
            name,
            location,
            numberOfEmployees,
            description
        });

        return res.status(201).json({ company, message: 'Company created successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error creating company' });
    }
};
