const express=require('express');
const app=express();



app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','signup.html'));
})
app.listen(1500,()=>{
    console.log("ChatApp started running on port 1500");
    
});