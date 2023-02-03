import mongoose from "mongoose";
import PostModel from "../Models/postModel.js";
import ReportModel from '../Models/ReportModels.js'

export const addReport = async (req, res, next) => {
    try {
        const userid = req.userId
        console.log("👽👽👽👽👽👽👽checking the userid in add report",userid);
        const postid = req.body.postid
        const reason = req.body.reason
        const report_action = false

        const hasReport = await ReportModel.findOne({ userid: mongoose.Types.ObjectId(userid), postid: mongoose.Types.ObjectId(postid) })
        if (!hasReport) {
            const post = await PostModel.findOne({ _id: mongoose.Types.ObjectId(postid) })
            if (post) {
                const report = new ReportModel({ userid, postid, reason, report_action })
                const savedreport = await report.save()
                if (savedreport) {
                    res.status(200).json({ report_post: true })
                } else {
                    res.status(400).json("Couldn't save")
                }
            } else {
                res.status(200).json({ report_post: false })
            }
        }else{
            res.status(200).json({has_report: true })
        }

    } catch (err) {
        res.status(500).json(err)
    }

}