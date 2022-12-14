import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import cors from 'cors'

//Routes
const app = express();
app.use(cors())

//Middleware
app.use(bodyParser.json({limit:'30mb', extended:true }));
app.use(bodyParser.urlencoded({limit:'30mb', extended:true }))

dotenv.config()

mongoose.connect(process.env.MONGO_DB,{useNewUrlParser: true , useUnifiedTopology: true})
.then(()=>app.listen(process.env.PORT,()=>console.log(`Database Connected at ${process.env.PORT} `)))
.catch((error)=>console.log("Database Connecting Error",error))


//usage of routes
app.use('/auth',AuthRoute)
app.use('/user', UserRoute)