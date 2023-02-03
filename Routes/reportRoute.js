import express from "express";
import { addReport } from "../Controllers/reportController.js";
import verifyToken from "../Middleware/middleware.js";

const router =express.Router()

router.post('/addcase',verifyToken,addReport)


export default router;