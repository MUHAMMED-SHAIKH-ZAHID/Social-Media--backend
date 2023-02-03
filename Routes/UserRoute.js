import express from "express";
import { clearNotification, deleteUser, followUser, getspecificuser, getUser, searchUsers, unfollowUser, updateUser} from "../Controllers/UserController.js";
import { isBlock } from "../Middleware/blockmiddleware.js";
import verifyToken from "../Middleware/middleware.js";

const router =express.Router()


router.get('/getUser',verifyToken,getUser )
router.get('/getspecificuser/:id',verifyToken,getspecificuser)
router.get('/clearNotification',verifyToken,isBlock,clearNotification)
router.post('/follow',verifyToken,followUser)
router.post('/unfollow',verifyToken,unfollowUser)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)
router.get('/searchUsers/:data',verifyToken, searchUsers)

export default router;