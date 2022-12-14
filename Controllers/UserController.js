import UserModel from "../Models/userModel.js";

//get a user
export const getUser = async(req,res)=>{
    const id =req.params.id;

    try {
        const user = await UserModel.findById(id)
        if(user){
            const {password, ...otherDetails} = user._doc
            res.status(200).json(otherDetails)
        }
        else{
            res.status(404).json("No such User Exist")
        }
        
    } catch (error) {
        res.status(500).json({message:error.message})
    
    }
}