import express from "express";
import {admingoogle, Adminlogin, adminremovePost, adminSinglePost, allPost, blockUser, Dashborddata, deletePostAdmin, deleteReport, getAllUsers, getReport } from "../Controllers/adminAuthController.js";

import verifyToken from "../Middleware/middleware.js";


const router =express.Router()

router.post('/login',Adminlogin)
router.post('/google',admingoogle)
router.get('/getReport',verifyToken,getReport)
router.delete('/deleteReport',verifyToken,deleteReport)
router.post('/removepost',verifyToken,adminremovePost)
router.delete('/deletepost/:id',verifyToken,deletePostAdmin)
router.get('/getallusers',verifyToken,getAllUsers)
router.post('/blockuser',verifyToken,blockUser)
router.get('/allPost',verifyToken,allPost)
router.get('/singlepost/:id',verifyToken,adminSinglePost)
router.get('/dashbordData',verifyToken,Dashborddata)

export default router;