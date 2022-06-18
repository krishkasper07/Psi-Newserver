const express = require("express");
const cors = require("cors");
const app = express();

require('dotenv').config();


const {API_PORT}=process.env;

const port=API_PORT;


//requiring express.json() for body parsing
app.use(express.json());

app.use(cors());

require('./db/db.config')();

const userRouter=require('./routers/auth');

const refreshRouter=require('./routers/refreshToken');

const orderRoute=require('./routers/ordersRoute');

const scannerRouter = require("./routers/scannerRoute");

const router = require("./routers/users");

const Abandoned = require("./routers/abandoned");

app.use('/api',userRouter);

app.use('/api/refreshToken',refreshRouter);

app.use('/api',router)

app.use('/api',orderRoute);

app.use('/api',scannerRouter);

app.use('/api/abandoned',Abandoned);

app.get('/',(req,res)=>{
    res.json('hello')
})



app.listen(port,()=>{
    console.log(`the server as started..in port http://localhost:${port}`)
});


