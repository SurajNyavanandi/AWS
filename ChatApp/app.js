const express = require('express');
const sequelize = require('./config/database');
const path = require('path');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const groupRoutes = require('./routes/group');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/group', groupRoutes);

app.use(express.static(path.join(__dirname, 'views')));
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'chat.html'));
});

sequelize.sync()
    .then(() => {
        console.log("Database Connected");
        app.listen(1500, () => console.log("Server running on http://localhost:1500/login"));
    })
    .catch(err => console.log("Database Not-Connected", err));
