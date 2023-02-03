import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
 


//Registering a new User
export const registerUser = async (req,res)=>{
    console.log(req.body,"password",req.body.password)

 const salt = await bcrypt.genSalt(10)
 const hashePass= await bcrypt.hash( req.body.password , salt );
 req.body.password=hashePass

 const newUser = new UserModel(req.body)
 console.log(newUser,"its the new User new User newUser new User newUser newUswe newUser newUser");
  const {username,email} = req.body
  console.log("email of the register ",email);

 try {
     console.log(req.body.username,"its the username of the yeear to test this shity things")
    const oldUser = await UserModel.findOne({username})
    const oldUserMail = await UserModel.findOne({email})
    console.log(oldUser,"the data in the old user to test weather everything is working correct or not ",oldUserMail)
    if(oldUser){
        return res.status(400).json({message:"username is already registered"})
    }else if(oldUserMail){
        return res.status,(400).json({message:"Email is Already Registered"}) 
    }
    else{
   const user= await newUser.save()
   const username=user._id
    const token =jwt.sign({
        username:user.username,id:user._id
    },process.env.JWT_KEY,{expiresIn:8400})
    res.status(200).json({username,token})
}
 } catch (error) {
    res.status(500).json({message:error.message})
 }
 
}

//Login User
export const loginUser = async (req,res) => {
    const {username,password} = req.body.data 
    console.log("its the login user in the backend",username,"password:  ",password)
    try {
        console.log(username,"asdfghjkklzxcvbnmqwertyuiop");
        const user = await UserModel.findOne({username: username})
        console.log("user details in the login",user);
        if(!user.isBlock){
            console.log(user,"the user find after seraching in db for login",user.password)
            const validity = await bcrypt.compare(password,user.password)

            if(!validity){
                res.status(400).json("Wrong Password")
            }
            else{
                const username=user._id
                const token =jwt.sign({
                    username:user.username,id:user._id
                },process.env.JWT_KEY,{expiresIn:8400})
                res.status(200).json({username,token})
            }

           // validity?res.status(200).json(user) : res.status(400).json("Wrong Password")
        }
        else{
            res.status(404).json("User Not Found")
        }
    } catch (error) {
        res.status(500).json({message:error.message},"error on req.body in loginUser AuthContreller")
    }
}

//Google User
export const googleuser = async(req,res) =>{
    console.log("it is the backend of google login ")
    const email = req.body.email
    try {
        const User = await UserModel.findOne({email:email})
        if(User){
            console.log("user already exist",User.username,User._id)
            const username=User._id
            const token=jwt.sign({
                username:User.username,id:User._id },
                process.env.JWT_KEY,{expiresIn:84000 })
                res.status(200).json({username,token})
                console.log("tocken sented",token);

        }else{
            console.log("else case of new google user",req.body);
            const User = await new UserModel({firstname:req.body.given_name,lastname:req.body.family_name,username:req.body.name,email:req.body.email,email_verified:req.body.email_verified}).save()
           console.log(User,"destructuring the details in teh google backend");
          // const googleuser = await User.save()
          // console.log(googleuser,"googleuser googleuser googleuser googleuser muhammed shaikh Zahid");
          const username=User._id
           const token=jwt.sign({
            username:User.username,id:User._id},
            process.env.JWT_KEY,{expiresIn:8400})
            res.status(200).json({username,token})
           // console.log(User,"the data sented to the frontend");
        }
        console.log("checking in the last of the google login the checking is the maximum of the year");
        
    } catch (error) {
        res.status(500).json({message:error.message})
     }

}