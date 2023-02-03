import mongoose from "mongoose";

const ReportSchema = mongoose.Schema(
    {
        userid:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        },
        postid:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Post"
        },
        reason:{
            type:String,
            required:true
        },
        report_action:{
            type:Boolean           
        }
    },
    {
        timestamps:true
    }
)

const ReportModel = mongoose.model("report",ReportSchema)
export default ReportModel