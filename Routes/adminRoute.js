import express from "express";
import { admingoogle, Adminlogin } from "../Controllers/adminAuthController.js";


const router =express.Router()

router.post('/login',Adminlogin)
router.post('/google',admingoogle)


export default router;