import express  from "express";
import {commentPost, createPost, deletePost, getAllPost, getPost, likePost, savePost, updatePost, UserProfile}  from "../Controllers/postController.js";
import verifyToken from "../Middleware/middleware.js";

const router = express.Router()

router.post('/',verifyToken,createPost)
router.get('/getfollwedpost',verifyToken, getAllPost)
router.get('/getpost/:id',verifyToken, getPost)
router.get('/userProfile/:id',verifyToken,UserProfile)
router.post('/save',verifyToken,savePost)
router.put('/:id',verifyToken,updatePost)
router.delete('/delete/:id',verifyToken,deletePost)
router.post('/like',verifyToken,likePost)
router.post('/comment',verifyToken,commentPost)


export default router