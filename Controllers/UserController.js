import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'
import PostModel from "../Models/postModel.js";

//get a user
export const getUser = async(req,res)=>{
    const id =req.userId
    console.log("inside the get user in userController ------------------------------------------old",id);
    try {
        const user = await UserModel.findById(id).populate('saved')
        const post = await PostModel.find({userId:id}).populate("comments.commentby")
        if(user){
            const {password, ...otherDetails} = user._doc
        otherDetails.post = post
     
            res.status(200).json(otherDetails)
           console.log(otherDetails.username,"otherdetails in the get a user which always want to show the current user loggedin");
        }
        else{
            res.status(404).json("No such User Exist")
        }
        
    } catch (error) {
        res.status(500).json({message:error.message})
    
    }
}



// Clear Notification
export const clearNotification = async (req,res) =>{
    const id= req.userId
    console.log("reached in the clear notification");
    try {
        const notification = []
        await UserModel.findByIdAndUpdate({ _id: id },{ notification :notification })
        res.status(200).json("Notification Cleared")
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}




//Update a User
export const updateUser = async (req,res) =>{
    const id=req.params.id
    const {userId,isAdmin,password} = req.body
    try {
        if(id===userId || isAdmin){
            if(password){
                const salt = await bcrypt.genSalt(10)
            }
            const user= await UserModel.findByIdAndUpdate(id,req.body,{new:true})
            res.status(200).json(user)
        }else{
         res.status(403).json("Access Denied ,You Can Update Only YOu r Profile")
        }
        
    } catch (error) {
        res.status(500).json(error)
    }
}

//Delete user
export const deleteUser = async (req,res) => {
    const id=req.params.id
    try {
        const{userId , isAdmin } = req.body
        if(userId === id || isAdmin){
         await UserModel.findByIdAndDelete(id)
            res.status(200).json("User Deleted Succesfully")
        }else{
            res.status(403).json("Access Denied , You cannot Delete the user")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//follow A User
export const followUser = async (req,res) =>{
    const id = req.body.id
    const userId = req.userId
    console.log(req.userId,"in the follow user first🎈🎈",id,userId);
    try {
        if(userId === id){
            res.status(403).json("Action Forbidden")
        }else{
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(userId)
            console.log(followingUser,"emergency situation of this year",!followUser.followers.includes(userId));
            if(!followUser.followers.includes(userId)){
                await followUser.updateOne({$push:{followers:userId}})
                await followingUser.updateOne({$push:{following:id}})
                res.status(200).json({status:true})
                
                  console.log("in the follow user 🎈 🎈");
            }else{
                
            console.log("in the Already a follower you cant understannd the situation 🎈🎈");
                res.status(200).json({status:false})
            }
        }
    } catch (error) {
        res.status(500).json(error)
    }

}

//Unfollow a user
export const unfollowUser = async (req,res) =>{
    const id = req.body.id
    const  userId = req.userId
    console.log(id,"UnfollowUser in the userController",userId);
    try {
        if(userId === id){
            res.status(403).json("Action Forbidden")
        }else{
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(userId)
            console.log(followUser,"looooooooooooooog",followingUser);
            if(followUser.followers.includes(userId)){
                await followUser.updateOne({$pull:{followers:userId}})
                await followingUser.updateOne({$pull:{following:id}})
                res.status(200).json({status:true})
            }else{
                res.status(403).json({status:false})
            }
        }
    } catch (error) {
        res.status(500).json(error)
    }

}

//get a user
export const getspecificuser = async(req,res)=>{
    const id =req.params.id
    console.log("inside the get user in userController new ---------------------------------------------",id);
    try {
        const user = await UserModel.findById(id)
        if(user){
            const {password, ...otherDetails} = user._doc
            
     
            res.status(200).json(otherDetails)
          
        }
        else{
            res.status(404).json("No such User Exist")
        }
        
    } catch (error) {
        res.status(500).json({message:error.message})
    
    }
}

//search a user
export const searchUsers = async (req, res, next) => {
    try {
        console.log("inside getUsers");
        const userId = mongoose.Types.ObjectId(req.userid);

        const searchResult = await UserModel.find({
            $and: [
                { _id: { $ne: userId } },
                { firstname: new RegExp("^" + req.params.data, "i") },
            ],
        })
        //firstname: new RegExp('^' + req.params.data, 'i')
        if (searchResult) {
            // console.log(userId,req.params.data.search,searchResult,"cvcvccvcvcccccv");
            res.status(200).json(searchResult);
        } else {
            res.status(400).json({ message: "No results" });
            throw new Error("No results");
        }
    } catch (error) {
        console.log("error", error);
    }
}

