const express = require('express');
const sequelize = require('./config/database');
const path = require('path');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const groupRoutes = require('./routes/group');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

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

// Socket.io event handling
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on('sendMessage', (message) => {
        io.emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

server.listen(1500, () => {
    console.log('Server is running on port 1500');
});
