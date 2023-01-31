import AdminModel from "../Models/AdminModels.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


//Login User
export const Adminlogin= async (req,res) => {
    const {username,password} = req.body.data 
    console.log("its the login user in the backend",username,"password:  ",password)
    try {
        console.log(username,"asdfghjkklzxcvbnmqwertyuiop");
        const user = await AdminModel.findOne({username: username})
        console.log("user details in the login",user);
        if(user){
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
export const admingoogle = async(req,res) =>{
    console.log("it is the backend of google login ")
    const email = req.body.email
    try {
        const User = await AdminModel.findOne({email:email})
        if(User){
            const username=User._id
            const token=jwt.sign({
                username:User.username,id:User._id },
                process.env.JWT_KEY,{expiresIn:84000 })
                res.status(200).json({username,token})
                console.log("tocken sented",token);

        }else{
          res.status(403).json("You Are Not Admin")
        }
      
        
    } catch (error) {
        res.status(500).json({message:error.message})
     }

}