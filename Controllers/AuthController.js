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
  const {username} = req.body

 try {
     console.log(req.body.username,"its the username of the yeear to test this shity things")
    const oldUser = await UserModel.findOne({username})
    console.log(oldUser,"the data in the old user to test weather everything is working correct or not ")
    if(oldUser){
        return res.status(400).json({message:"username is already registered"})
    }
   const user= await newUser.save()
    const token =jwt.sign({
        username:user.username,id:user._id
    },process.env.JWT_KEY,{expiresIn:8400})
    res.status(200).json({user,token})
 } catch (error) {
    res.status(500).json({message:error.message})
 }
 
}

//Login User
export const loginUser = async (req,res) => {
    console.log("its the login user in the backend")
    const {username,password} = req.body 
    try {
        const user = await UserModel.findOne({username: username})
        if(user){
            const validity = await bcrypt.compare(password,user.password)

            if(!validity){
                res.status(400).json("Wrong Password")
            }
            else{
                const token =jwt.sign({
                    username:user.username,id:user._id
                },process.env.JWT_KEY,{expiresIn:8400})
                res.status(200).json({user,token})
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