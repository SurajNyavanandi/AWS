// models/index.js
const User = require('./user');
const Recipe = require('./recipe');
const Review = require('./review');
const Favorite = require('./favorite');
const Following = require('./following');

// User Associations
User.hasMany(Recipe, { foreignKey: 'user_id' });
User.hasMany(Review, { foreignKey: 'user_id' });
User.hasMany(Favorite, { foreignKey: 'user_id' });
User.hasMany(Following, { foreignKey: 'follower_id', as: 'Following' }); 

// Recipe Associations
Recipe.belongsTo(User, { foreignKey: 'user_id' });
Recipe.hasMany(Review, { foreignKey: 'recipe_id' });
Recipe.hasMany(Favorite, { foreignKey: 'recipe_id' });

// Review Associations
Review.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(Recipe, { foreignKey: 'recipe_id' });

// Favorite Associations
Favorite.belongsTo(User, { foreignKey: 'user_id' });
Favorite.belongsTo(Recipe, { foreignKey: 'recipe_id' });

module.exports = {User,Recipe,Review,Favorite, Following };
