//util//database.js
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://krisurajdec:gLXRzD4hs15oeJkY@cluster0.fplt7.mongodb.net/?retryWrites=true&w=majority'
  )
    .then(client => {
      console.log('Connected to MongoDB!');
      callback(client);
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB:', err);
    });
};

module.exports = mongoConnect; // Ensure this line is correct
