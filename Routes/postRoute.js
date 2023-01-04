import express  from "express";
import {commentPost, createPost, deletePost, getAllPost, getPost, likePost, updatePost}  from "../Controllers/PostController.js";
import verifyToken from "../Middleware/middleware.js";

const router = express.Router()

router.post('/',verifyToken,createPost)
router.get('/getfollwedpost',verifyToken, getAllPost)
router.get('/getpost/:id',verifyToken, getPost)
router.put('/:id',verifyToken,updatePost)
router.delete('/:id',verifyToken,deletePost)
router.post('/like',verifyToken,likePost)
router.post('/comment',verifyToken,commentPost)


export default router