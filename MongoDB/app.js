const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database'); 

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  next();
});

// Connect to MongoDB
mongoConnect(client => {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});
