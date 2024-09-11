const sequelize = require('../config/database');
const Company = require('./company');
const Job = require('./job');

Company.hasMany(Job, { foreignKey: 'companyId' });
Job.belongsTo(Company, { foreignKey: 'companyId' });

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Models synchronized successfully.');
    })
    .catch((error) => {
        console.error('Error syncing models:', error);
    });

module.exports = {
    Company,
    Job,
};
