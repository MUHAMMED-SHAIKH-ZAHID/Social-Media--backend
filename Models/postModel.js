import mongoose, { Mongoose } from "mongoose";

const PostSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    caption:String,
    likes: [],
    image:String,
    comments:[
        {comment:String,
        commentby:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        createdAt:{
            type:String,
            default:new Date().toDateString()
        }
        }
    ]
},{timestamps:true})

const PostModel =mongoose.model('Post',PostSchema)

export default PostModel;