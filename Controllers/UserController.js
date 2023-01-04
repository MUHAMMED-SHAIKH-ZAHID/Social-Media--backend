import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'

//get a user
export const getUser = async(req,res)=>{
    const id =req.params.id;

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
    const id = req.params.id
    const { userId }= req.body
    try {
        if(userId === id){
            res.status(403).json("Action Forbidden")
        }else{
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(userId)
            console.log(followUser,"looooooooooooooog",followingUser); 
            console.log("its the output in the follow a user in user controller :",!followUser.followers.includes(userId));
            if(!followUser.followers.includes(userId)){
                await followUser.updateOne({$push:{followers:userId}})
                await followingUser.updateOne({$push:{following:id}})
                res.status(200).json("user followed Succesfully")
            }else{
                res.status(403).json("User Already followed By YOu")
            }
        }
    } catch (error) {
        res.status(500).json(error)
    }

}

//Unfollow a user
export const unfollowUser = async (req,res) =>{
    const id = req.params.id
    const { userId }= req.body
    try {
        if(userId === id){
            res.status(403).json("Action Forbidden")
        }else{
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(userId)
            console.log(followUser,"looooooooooooooog",followingUser);
            if(followUser.followers.includes(userId)){
                await followUser.updateOne({$pull:{followers:userId}})
                await followingUser.updateOne({$pull:{following:userId}})
                res.status(200).json("user followed Succesfully")
            }else{
                res.status(403).json("User Already followed By YOu")
            }
        }
    } catch (error) {
        res.status(500).json(error)
    }

}