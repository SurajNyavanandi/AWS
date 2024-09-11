const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoute = require('./routes/user');
const jobRoute = require('./routes/job');
const companyRoute = require('./routes/company');
const path = require('path');
require('dotenv').config();
const app = express();
require('./models/index');

app.use(bodyParser.json());
app.use('/user', userRoute);
app.use('/jobs', jobRoute); 
app.use('/company', companyRoute);

app.use(express.static(path.join(__dirname, 'views')));
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

sequelize.authenticate()
    .then(() => {
        console.log("Database Connected");
        app.listen(7015, () => console.log("Server running on http://localhost:7015/login"));
    })
    .catch(err => console.log("Database Not-Connected", err));
