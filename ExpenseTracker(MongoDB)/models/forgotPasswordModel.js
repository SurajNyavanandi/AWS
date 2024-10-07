//models/forgetPasswordModel.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const forgotPasswordRequestSchema = new Schema({
    id: { type: String, default: uuidv4, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true }
});

const ForgotPasswordRequest = mongoose.model('ForgotPasswordRequest', forgotPasswordRequestSchema);
module.exports = ForgotPasswordRequest;

