//app.js
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoute = require('./routes/userRouter');
const expenseRoute=require('./routes/expenseRouter');
const premiumRoute=require('./routes/premiumRouter');
const passwordRoute=require('./routes/passwordRouter');
const cors=require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRoute);
app.use('/expense',expenseRoute);
app.use('/premium',premiumRoute);
app.use('/password',passwordRoute);

app.use(express.static(path.join(__dirname, 'views')));

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','login.html'));
});
app.get('/addexpense',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','expense.html'));
})
app.get('/password',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','password.html'));
})
app.get('/password/resetpassword/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'resetpassword.html'));
});
// {force:true}
sequelize.sync()
    .then(() => {
        console.log("Database Connected");
        app.listen(7000, () => console.log("Server running on http://localhost:7000/signup"));
    })
    .catch(err => console.log("Database Not-Connected", err));
