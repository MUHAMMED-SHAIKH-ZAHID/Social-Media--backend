import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";


//Create A Post
export const createPost = async(req,res) =>{
    req.body.userId = req.userId
    console.log("its in sdhfkdfk",req.body)
    const newPost = new PostModel(req.body)
    try {
        await newPost.save()
        res.status(200).json("Post Created")
    } catch (error) {
        res.status(500).json(error)
    }
}

//Get Followed post
export const getAllPost = async(req,res) => {
   const userId= req.userId
   console.log("its in the getfollowed posgt in postController",userId);
   try {
    const followers=await UserModel.find()
     const CurrentUserPost = await PostModel.find({userId:userId})
     const followingPost = await PostModel.find().populate("userId", "-password").populate("comments.commentby","-password").sort({ createdAt: -1 })
     let posts =  followingPost
     res.status(200).json({posts,userId})
   } catch (error) {
    res.status(500).json(error)
   }
}

//Get a post
export const getPost = async (req,res) => {
    const id=req.params.id
    try {
        const post = await PostModel.findById(id).populate('userId').populate("comments.commentby")
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
        
    }
}

//get User Profile
export const UserProfile =async(req,res)=>{
    const id =req.params.id
    console.log(id,"...............................its the params.......................");
    try {
         const user = await UserModel.findById(id).populate('following','followers')
        const post = await PostModel.find({userId:id}).sort({ createdAt: -1 })
       
        res.status(200).json({user,post})
    } catch (error) {
        res.status(500).json(error)
    }
}

//save Post
export const savePost = async(req,res)=>{
    const postId =req.body.id
    const userId = req.userId
    try {
        const user = await UserModel.findById(userId)
        const post = await PostModel.findById(postId)
        if(!user.saved.includes(postId)){
         await user.updateOne({$push : {saved: postId}})
         res.status(200).json({status:true,post:post})
         console.log("added saved post");
        }else{
            await user.updateOne({$pull : {saved: postId}})
         res.status(200).json({status:false})
         console.log("removed from saved");
        }
    } catch (error) {
        res.status(500).json(error)
    }

}

//Update a Request
export const updatePost = async (req,res) =>{
    console.log(req.body,"body of update post");
    const postId = req.body.id
    const userId = req.userId
    try {
        const post = await PostModel.findById(postId)
        console.log(userId == post.userId,"checking");
        if(post.userId == userId ){
            await post.updateOne ({$set : { caption : req.body.text}})
            res.status(200).json("Post Updated")
        }else{
            res.status(403).json("Action Forbidden")
        }
    } catch (error) {
        console.log(error,"cach in the update request")
      res.status(500).json(error)  
    } 
}

//Delete A Post
export const deletePost = async (req,res)=>{
    console.log("its the delete a post route 💕💕");
    const id = req.params.id;
    const userId =  req.userId
    console.log("its the delete a post route 💕💕",userId,id);
    try {
        const post = await PostModel.findById(id)
        console.log(post,"will this work for me ",post.userId , userId);

        if(post.userId == userId){
            console.log("its in the if of the Delete delete post Post");
             await PostModel.findByIdAndDelete(id)
             res.status(200).json("Post Deleted Succesfully")
        }else{
           res.status(403).json("Action Forbidden")
        }
        
    } catch (error) {
        res.status(500).json(error)  

    }
}

//Like and Dislike a Post
export const likePost = async (req,res) =>{
    console.log("reached in the like and dislike post controller");
    
    const id = req.body.id;
    const userId = req.userId
    try {
        const post = await PostModel.findById(id)
        if(!post.likes.includes(userId)){
            await post.updateOne({$push : {likes: userId}})
            res.status(200).json("Post Liked")
            const user = await UserModel.findById(userId)
             const notification = {
                message:`${user.username} liked your post`,
                profilepic:user.profilePicture,
                title:"Like",
                time:Date.now(),
                postpic:post.image,
                postlink:post._id
             }
   
             
                 if(userId!=post.userId){
                    console.log("notification saved");
                     await UserModel.findByIdAndUpdate({_id:post.userId},{$push:{ notification : notification }})
                 }
                
             
          
        }else{
            console.log("dislikeddddddddddd");
            await post.updateOne({$pull :{likes: userId}})
            res.status(200).json("Post Disliked")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//Comment a post
export const commentPost = async (req, res, next) => {
  const postid = mongoose.Types.ObjectId(req.body.id)
  let user = req.userId
  const userid = user
  const comment = req.body.commentText
  const post = await PostModel.findById(postid)
  try {
      await PostModel.updateOne({ _id: postid }, { $push: { comments: { comment: comment, commentby: userid, createdAt: new Date() } } })
      const comments= { comment: comment, commentby: userid, createdAt: new Date(),post:postid } 
      res.status(200).json({ comments })
      const user = await UserModel.findById(userid)
      const notification = {
         message:`${user.username} commented ${comment}`,
         profilepic:user.profilePicture,
         title:"Comment",
         time:Date.now(),
         postpic:post.image,
         postlink:post._id
      }

      
          if(userid!=post.userId){
             console.log("notification for comment saved");
              await UserModel.findByIdAndUpdate({_id:post.userId},{$push:{ notification : notification }})
          }
         
      
  } catch (error) {
      console.log(error);
      res.status(500).json(error)

  }
}