import express from 'express'
import { createChat, findChat, userChat } from '../Controllers/chatController.js'
import verifyToken from '../Middleware/middleware.js'


const router = express.Router()

router.post('/createChat',verifyToken,createChat)
router.get('/userChats',verifyToken,userChat)
router.get('/find/:firstId/:secondId',verifyToken,findChat)


export default router