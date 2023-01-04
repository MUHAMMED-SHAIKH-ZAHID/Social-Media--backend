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
     console.log("spaam",posts)
     res.status(200).json({posts,userId})
   } catch (error) {
    res.status(500).json(error)
   }
}

//Get a post
export const getPost = async (req,res) => {
    const id=req.params.id
    console.log("Enterd to getposet with id",id)
    try {
        const post = await PostModel.findById(id)
        res.json(200).json(post)
    } catch (error) {
        res.status(500).json(error)
        
    }
}

//Update a Request
export const updatePost = async (req,res) =>{
    const postId = req.params.id
    const {userId} = req.body
    try {
        const post = await PostModel.findById(postId)
        if(post.userId === userId ){
            await post.updateOne ({$set : req.body})
            res.status(200).json("Post Updated")
        }else{
            res.status(403).json("Action Forbidden")
        }
    } catch (error) {
      res.status(500).json(error)  
    } 
}

//Delete A Post
export const deletePost = async (req,res)=>{
    const id = req.params.id;
    const {userId} = req.body;
    try {
        const post = await PostModel.findById(id)
        if(post.userId === userId){
            await post.deleteOne();
            res.status(200).json("Post Deleted Succesfully")
        }else{
            res.json(403).json("Action Forbidden")
        }
        
    } catch (error) {
        res.status(500).json(error)  

    }
}

//Like and Dislike a Post
export const likePost = async (req,res) =>{
    
    const id = req.body.id;
    const userId = req.userId
    try {
        const post = await PostModel.findById(id)
        if(!post.likes.includes(userId)){
            await post.updateOne({$push : {likes: userId}})
            res.status(200).json("Post Liked")
        }else{
            await post.updateOne({$pull :{likes: userId}})
            res.status(200).json("Post Disliked")
        }
    } catch (error) {
        
    }
}

//Comment a post
export const commentPost = async (req, res, next) => {
  const postid = mongoose.Types.ObjectId(req.body.id)
  let user = req.userId
 console.log("in the comment and",user,postid);
  const userid = user
  const comment = req.body.commentText
  try {
      await PostModel.updateOne({ _id: postid }, { $push: { comments: { comment: comment, commentby: userid, createdAt: new Date() } } })
      res.json({ status: true })
  } catch (error) {
      console.log(error);
      res.status(500).json(error)

  }
}