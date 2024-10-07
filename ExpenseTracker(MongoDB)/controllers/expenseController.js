//controllers/expenseController.js
const Expense = require('../models/expenseModel');
const User = require('../models/userModel');
const { getExpenses } = require('../services/userService');
const uploadToS3 = require('../services/S3service');

exports.createExpense = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        const { amount, description, category } = req.body;

        const expense = new Expense({
            amount,
            description,
            category,
            userId
        });
        await expense.save();

        if (expense) {
            user.totalAmount = Number(expense.amount) + Number(user.totalAmount);
            await user.save();
        }

        return res.status(201).json(expense);
    } catch (error) {
        return res.status(500).json({ Error: 'Error creating expense' });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const userId = req.userId;
        const id = req.params.id;

        const user = await User.findById(userId);
        const expense = await Expense.findById(id);

        if (expense) {
            user.totalAmount = Number(user.totalAmount) - Number(expense.amount);
            await user.save();
            await Expense.deleteOne({ _id: id });
        }

        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ Error: 'Error deleting expense' });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const expenses = await Expense.find({ userId: userId })
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });

        const totalCount = await Expense.countDocuments({ userId: userId });

        return res.status(200).json({
            expenses,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (error) {
        return res.status(500).json({ Error: 'Error getting expenses' });
    }
};

exports.getDailyExpenses = async (req, res) => {
    try {
        const userId = req.userId;
        const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

        const expenses = await Expense.find({
            userId: userId,
            createdAt: { $gte: startOfDay, $lt: endOfDay }
        });

        return res.status(200).json(expenses);
    } catch (error) {
        return res.status(500).json({ Error: 'Error fetching daily expenses' });
    }
};

exports.getMonthlyExpenses = async (req, res) => {
    try {
        const userId = req.userId;
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const expenses = await Expense.find({
            userId: userId,
            createdAt: { $gte: startOfMonth, $lt: endOfMonth }
        });

        return res.status(200).json(expenses);
    } catch (error) {
        return res.status(500).json({ Error: 'Error fetching monthly expenses' });
    }
};

exports.getYearlyExpenses = async (req, res) => {
    try {
        const userId = req.userId;
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31);

        const expenses = await Expense.find({
            userId: userId,
            createdAt: { $gte: startOfYear, $lt: endOfYear }
        });

        return res.status(200).json(expenses);
    } catch (error) {
        return res.status(500).json({ Error: 'Error fetching yearly expenses' });
    }
};

exports.downloadExpense = async (req, res) => {
    try {
        const userId = req.userId;
        const expenses = await getExpenses(userId); 
        const stringifiedExpenses = JSON.stringify(expenses);
        const filename = `Expense${userId}/(${new Date()}).txt`;
        const fileurl = await uploadToS3(stringifiedExpenses, filename);
        return res.status(200).json({ fileurl, Message: true });
    } catch (error) {
        console.error("Error downloading expense file", error);
        return res.status(500).json({ Error: 'Error downloading expense file' });
    }
};
