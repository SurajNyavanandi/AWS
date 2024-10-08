//models/userModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalAmount: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

