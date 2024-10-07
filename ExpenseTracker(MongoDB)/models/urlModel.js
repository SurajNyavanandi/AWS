//models/urlModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
    url: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;

