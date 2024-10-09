//models/expenseModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });  // This line adds createdAt and updatedAt fields


const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
