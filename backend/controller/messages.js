import Message from "../models/Message.js";
import {encryption, decryption} from '../utils/encryption.js'
export const saveMessage=async(req, res)=>{
    try{
        const {sender, receiver, message}=req.body;
        if(!sender || !receiver || !message){
            return res.status(400).json({message:"Invalid input"});
        }
        const {encrypted, ivtext}= encryption(message);
        const id=await Message.create({sender, receiver, message:encrypted, IV:ivtext});
        res.status(200).json({message:"message saved", id:id});
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

export const getMessage=async(req, res)=>{
    try{
        const {id}=req.body;
        if(!id){
            return res.status(400).json({message:"Invalid input"});
        }
        const data=await Message.find({_id:id});
        if(!data){
            return res.status(400).json({message:"Id not found"});
        }
        const msg= await decryption(data[0].message, data[0].IV);
        res.status(200).json({message:"Message found", msg:msg});

    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

export const getMessages= async(req, res)=>{
    try{
        const {user1, user2}=req.body;
        if(!user1 || !user2){
            return res.status(400).json({message:"Users not found"})
        }
        const data= await Message.find({$or:[{sender:user1, receiver:user2}, {sender:user2 ,receiver:user1}]})
        const messages=data.map(m=>({sender:m.sender, receiver:m.receiver, seen:m.seen, message:decryption(m.message, m.IV)}));
        res.status(200).json({message:messages});
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}