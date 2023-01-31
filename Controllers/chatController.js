import ChatModel from "../Models/chatModel.js";

export const createChat = async(req,res)=>{
    console.log("inside the create chat");
    senderId = req.userId
    const newChat = new ChatModel({
        members:[senderId , req.body.recieverId]
    })
    try {
        const result = await newChat.save();
        res.status(200).json(result)
        
    } catch (error) {
        res.status(500).json(error)
    }
}

export const userChat = async(req,res)=>{
    console.log("inside the userChat");
    try {
        
       const chat = await ChatModel.find({
        members:{$in:[req.userId]}
       })
       res.status(200).json({chat,user:req.userId})
    } catch (error) {
       res.status(500).json(error) 
    }
}

export const findChat = async(req,res)=>{
    try {
        
        const chat = await ChatModel.findOne({
            members:{$all:[req.userId,req.params.secondId]}
        })
        res.status(200).json(chat)

    } catch (error) {
        res.status(500).json(error)   
    }
}