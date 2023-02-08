import mongoose from "mongoose";
import AdminModel from "../Models/AdminModels.js";
import ReportModel from '../Models/ReportModels.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from "../Models/userModel.js";
import PostModel from "../Models/postModel.js";


//Login User
export const Adminlogin= async (req,res) => {
    const {username,password} = req.body.data 
    console.log("its the login user in the backend",username,"password:  ",password)
    try {
        console.log(username,"asdfghjkklzxcvbnmqwertyuiop");
        const user = await AdminModel.findOne({username: username})
        console.log("user details in the login",user);
        if(user){
            console.log(user,"the user find after seraching in db for login",user.password)
            const validity = await bcrypt.compare(password,user.password)

            if(!validity){
                res.status(400).json("Wrong Password")
            }
            else{
                const username=user._id
                const token =jwt.sign({
                    username:user.username,id:user._id
                },process.env.JWT_KEY,{expiresIn:84000})
                res.status(200).json({username,token})
            }

           // validity?res.status(200).json(user) : res.status(400).json("Wrong Password")
        }
        else{
            res.status(404).json("User Not Found")
        }
    } catch (error) {
        res.status(500).json({message:error.message},"error on req.body in loginUser AuthContreller")
    }
}

//Google User
export const admingoogle = async(req,res) =>{
    console.log("it is the backend of google login ")
    const email = req.body.email
    try {
        const User = await AdminModel.findOne({email:email})
        if(User){
            const username=User._id
            const token=jwt.sign({
                username:User.username,id:User._id },
                process.env.JWT_KEY,{expiresIn:84000 })
                res.status(200).json({username,token})
                console.log("tocken sented",token);

        }else{
          res.status(403).json("You Are Not Admin")
        }
      
        
    } catch (error) {
        res.status(500).json({message:error.message})
     }

}

export const getReport = async (req, res, next) => {
    console.log("in the reportcontroller ❗❗❗");
    try {
        if(req.userId){

            const report = await ReportModel.find({ report_action: false }).populate({ path: "userid", select: { 'firstname': 1, 'lastname': 1, "profilePicture": 1 } })
            .populate({ path: "postid", select: { 'userId': 1, 'image':1 }, populate: { path: "userId", select: { 'firstname': 1, "lastname": 1, "profilePicture": 1 } } })
            .sort({ createdAt: -1 })
            if (report) {
                res.status(200).json({ report })
            } else {
                res.status(400).json("Couldn't get report")
            }
        }

    } catch (err) {
        res.status(500).json(err)
    }
}

export const deleteReport = async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(req.userId){
             console.log(req.body.reportid, "Reportid");
            await ReportModel.deleteOne({ _id: mongoose.Types.ObjectId(req.body.reportid) })
            resolve({ delStatus: true })
            }
        } catch (err) {
            reject(err)
        }
    })
}

export const adminremovePost = async (req,res)=>{
  
    const id = req.body.postID
    const Reportid=req.body.reportID
    const userId =  req.userId
    console.log("its the delete a post route admin 💕💕",userId,id,Reportid);
    try {
        if(req.userId){
        const post = await PostModel.findById(id)
        if(post){
            console.log("its in the if of the Delete delete post Post");
            await PostModel.findByIdAndDelete(id)
          await ReportModel.updateOne({ _id: mongoose.Types.ObjectId(Reportid) }, { report_action: true })
             res.status(200).json("Post Deleted Succesfully")
        }
        }else{
           res.status(403).json("Action Forbidden")
        }
        
    } catch (error) {
        res.status(500).json(error)  

    }
}

export const getAllUsers = async (req, res, next) => {
    try {
        if(req.userId){
            const users = await UserModel.find({}, { _id: 1, firstname: 1, lastname: 1, isBlock: 1, profilePicture: 1, email: 1, email_verified : 1, total_followers: { $size: "$followers" }, total_following: { $size: "$following" } })
            if (users) {
                res.status(200).json(users)
            } else {
                res.status(200).json({ isUsers: false })
            }
        }

    } catch (error) {
        console.log("error", error);
    }
}


export const blockUser = (req, res, next) => {
    return new Promise(async (resolve, reject) => {
      console.log(req.body);
        try {      if(req.userId){
            if (req.body.isBlock == false) {
                await UserModel.updateOne({ _id: req.body.userid }, { isBlock: true })
                //resolve({ isBlock: true })
                  res.json({ isBlock: true })
            } else {
                await UserModel.updateOne({ _id: req.body.userid }, { isBlock: false })
                //resolve({ isBlock: false })
                res.json({ isBlock: false })
            }
        }
        } catch (error) {
            reject(error)
        }
    })

}

export const allPost = (req,res,next) => {
    return new Promise (async (resolve,reject) => {
        console.log("in the all post");
        try {
            const Post = await PostModel.find().populate("userId", "-password").populate("comments.commentby","-password").sort({ createdAt: -1 })
            res.status(200).json(Post)
            
        } catch (error) {
            console.log(error,"aesrrror");
            res.status(500).json(error)
        }
    })
}

export const adminSinglePost = async (req,res)=>{
  console.log("in the admin single post feature",req.params);
   const id= req.params.id
    try {
        if(req.userId){

            const post = await PostModel.findById(id).populate('userId').populate("comments.commentby")
            res.status(200).json(post)
          
        }else{
           res.status(403).json("Action Forbidden")
        }
        
    } catch (error) {
        res.status(500).json(error)  

    }
}

export const deletePostAdmin = async (req,res)=>{
    console.log("its the delete a post route admin 💕💕");
    const id = req.params.id;
    const userId =  req.userId
    console.log("its the delete a post route delete post Admin 💕💕",userId,id);
    try {
        if(userId){

            const post = await PostModel.findById(id)
            console.log(post,"will this work for me ",post.userId , userId);
    
            if(post){
                console.log("its in the if of the Delete delete post Post");
                 await PostModel.findByIdAndDelete(id)
                 res.status(200).json("Post Deleted Succesfully")
            }else{
                res.status(403).json("post not found")

        }
           
        }else{
            res.status(404).json("Not Authenticated")
        }
        
    } catch (error) {
        console.log(error,"its hte ashwanths method");
        res.status(500).json(error)  

    }
}

export const Dashborddata = async (req,res)=>{
    console.log("in the admin dashbord data 🤷‍♀️🤷‍♀️",);
  
      try {
          if(req.userId){
              const users = await UserModel.find({}).select('email_verified')
              const weekAgo = new Date();
               weekAgo.setDate(weekAgo.getDate() - 7);
              const count = await UserModel.find({ createdAt: { $gte: weekAgo } }).exec((err, data) => {
                if (err) {
                  console.error(err);
                } else {
                    res.status(200).json({users:users,data:data})
                  console.log(data,"is this the data we are geyying");
                }
              })
              console.log("in the getpost ❤️❤️",count);
            
          }else{
             res.status(403).json("Action Forbidden")
          }
          
      } catch (error) {
          res.status(500).json(error)  
  
      }
  }