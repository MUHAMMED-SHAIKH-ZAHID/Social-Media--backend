import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import PostRoute from './Routes/PostRoute.js'
import cors from 'cors'
import morgan from "morgan";

//Routes
const app = express();
app.use(cors())
app.use(morgan('tiny'))

//Middleware
app.use(express.json({limit:'30mb', extended:true }));
app.use(express.urlencoded({limit:'30mb', extended:true }))

dotenv.config()

mongoose.connect(process.env.MONGO_DB,{useNewUrlParser: true , useUnifiedTopology: true})
.then(()=>app.listen(process.env.PORT,()=>console.log(`Database Connected at ${process.env.PORT} `)))
.catch((error)=>console.log("Database Connecting Error",error))


//usage of routes
app.use('/auth',AuthRoute)
app.use('/user', UserRoute)
app.use('/Post',PostRoute)