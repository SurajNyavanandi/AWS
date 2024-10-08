// services/userService.js
const Expense = require('../models/expenseModel');

exports.getExpenses = async (userId) => {
    try {
        const expenses = await Expense.find({ userId: userId }); 
        return expenses;
    } catch (error) {
        throw new Error('Error getting expenses: ' + error.message);
    }
};