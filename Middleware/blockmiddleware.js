import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";

 export const  isBlock = async(req,res,next)=>{
    const id=req.userId
    try {
       const user = await UserModel.findById(id)   
       if(user.isBlock === true){
        console.log("💀💀💀💀💀💀 User Blocked");
         res.status(403).json("userBlocked")
       }else{
        console.log('💚🍏💚💚💚💚');
         next()
       }
    } catch (error) {
        res.status(500).json(error)
    }
}