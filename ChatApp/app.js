const express=require('express');
const sequelize = require('./config/database');
const path = require('path');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRouter');
const cors = require('cors');
require('dotenv').config();
const app=express();

const corsOptions = {
    origin: 'http://localhost:1500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/user', userRouter);

app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','signup.html'));
})
sequelize.sync()
    .then(() => {
        console.log("Database Connected");
        app.listen(1500, () => console.log("Server running on http://localhost:1500/signup"));
    })
    .catch(err => console.log("Database Not-Connected", err));
