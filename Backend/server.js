const express=require('express')
const app=express();
const dotenv=require('dotenv');
const connectToDB = require('./configs/db');



app.use(express.json())
dotenv.config();
app.get('/',(req,res)=>{
    res.send("This is a home route")
})

const db_url=process.env.DB_URL
const port=process.env.PORT || 9090
app.listen(port,()=>{
    try {
        connectToDB(db_url);
        console.log(`server is running at http://localhost:${port}`)
    } catch (error) {
       console.log(error) 
    }
})