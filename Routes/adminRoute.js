import express from "express";
import { admindeletePost, admingoogle, Adminlogin, blockUser, deleteReport, getAllUsers, getReport } from "../Controllers/adminAuthController.js";

import verifyToken from "../Middleware/middleware.js";


const router =express.Router()

router.post('/login',Adminlogin)
router.post('/google',admingoogle)
router.get('/getReport',verifyToken,getReport)
router.delete('/deleteReport',verifyToken,deleteReport)
router.post('/deletepost',verifyToken,admindeletePost)
router.get('/getallusers',verifyToken,getAllUsers)
router.post('/blockuser',verifyToken,blockUser)

export default router;