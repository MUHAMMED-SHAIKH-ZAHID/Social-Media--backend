import express from "express";
import { clearNotification, deleteUser, followUser, getspecificuser, getUser, unfollowUser, updateUser} from "../Controllers/UserController.js";
import verifyToken from "../Middleware/middleware.js";

const router =express.Router()

router.get('/getUser',verifyToken,getUser )
router.get('/getspecificuser/:id',verifyToken,getspecificuser)
router.get('/clearNotification',verifyToken,clearNotification)
router.post('/follow',verifyToken,followUser)
router.post('/unfollow',verifyToken,unfollowUser)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)
export default router;