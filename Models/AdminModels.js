import mongoose from "mongoose";

const AdminSchema= mongoose.Schema(
    {
        username: {
            type: String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        firstname:{
            type:String,
            required: true
        },lastname:{
            type:String,
            
        },
        password:{
            type:String,
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        email_verified:Boolean,
        profilePicture:String,
        notification:[
            {type:Object}
        ],
        coverPicture:String,
        about:String,
        livesIn:String,
        worksAt:String,
        relationship:String,
        followers:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }], 
        following:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        ],
         saved:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Post'
            } 
        ],

    },

    {timestamps: true}
)

const AdminModel = mongoose.model('Admin',AdminSchema)
export default AdminModel;