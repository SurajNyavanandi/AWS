// models/recipe.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recipe = sequelize.define('Recipe', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    ingredients: DataTypes.TEXT,
    instructions: DataTypes.TEXT,
    cooking_time: DataTypes.INTEGER,
    servings: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: 'Users', key: 'id' } 
    }
});

module.exports = Recipe;
