const express = require('express');
const sequelize = require('./config/database');
const path = require('path');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const groupRoutes = require('./routes/group');
const publicGroupRoutes = require('./routes/publicGroup');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
require('./cron/archiveOldMessages');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/group', groupRoutes);
app.use('/publicgroup', publicGroupRoutes);

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

// Socket.IO Implementation
const activeUsers = new Map();

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (err) {
        next(new Error("Authentication error"));
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    activeUsers.set(socket.userId, socket.id);

    // Notify all clients about the updated online users
    emitOnlineUsers();

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
        activeUsers.delete(socket.userId);
        emitOnlineUsers();
    });

    socket.on('sendMessage', async (data) => {
        const PublicGroup = require('./models/publicGroup');
        const User = require('./models/user');

        try {
            const newMessage = await PublicGroup.create({
                message: data.message,
                UserId: socket.userId
            });

            const user = await User.findByPk(socket.userId);

            io.emit('newMessage', {
                id: newMessage.id,
                message: newMessage.message,
                createdAt: newMessage.createdAt,
                User: {
                    name: user.name
                }
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });
});

function emitOnlineUsers() {
    const User = require('./models/user');
    User.findAll({
        where: { isLoggedIn: true },
        attributes: ['id', 'name']
    })
    .then(users => {
        io.emit('onlineUsers', users);
    })
    .catch(err => console.error('Error fetching online users:', err));
}

sequelize.sync()
    .then(() => {
        console.log("Database Connected");
        server.listen(1500, () => console.log("Server running on http://localhost:1500/login"));
    })
    .catch(err => console.log("Database Not-Connected", err));
