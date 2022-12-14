import mongoose from "mongoose";

const UserSchema= mongoose.Schema(
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
            required:true
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        profilePicture:String,
        coverPicture:String,
        about:String,
        livesIn:String,
        worksAt:String,
        relationship:String,
        followers:[], 
        following:[]
        

    },
    {timestamps: true}
)

const UserModel = mongoose.model('User',UserSchema)

export default UserModel;