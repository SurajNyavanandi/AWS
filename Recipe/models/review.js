// models/review.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: DataTypes.TEXT,
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: 'Users', key: 'id' } 
    },
    recipe_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: 'Recipes', key: 'id' } 
    }
});

module.exports = Review;
