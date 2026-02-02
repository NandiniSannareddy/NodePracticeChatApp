import User from '../models/User.js'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const createUser=async (req, res)=>{
    try{
        const {name, email, password}=req.body;
        const pass=await bcrypt.hash(password, 5);
        const user=await User.findOne({email});
        if(user){
            return res.status(401).json({message:"email already exists"});
        }
        const token=crypto.randomBytes(32).toString("hex");
        const transport= nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.user,
                pass:process.env.pass
            }
        })
        await transport.sendMail({
            from:process.env.user,
            to:email,
            subject:"email verification",
            html:`<a href='${process.env.mailLink}/${token}'><button>Verify</button></a>`
        })
        const createdUser= await User.create({name:name, email:email, password:pass, verificationToken:token});
        const id=await jwt.sign({userId:createdUser._id}, process.env.jwt_secretKey, {expiresIn:"1d"});
        res.status(201).json({message:"check your email for verification",id:id});
    }
    catch(err){
        res.status(500).json(err.message);
    }
}

export const login=async(req, res)=>{
    try{
        const {email, password}=req.body;
        const user=await User.findOne({email}).select("+password");
        if(!user){
           return res.status(401).json({message:"user doesn't exist with that email id"});
        }
        if(!user.isVerified){
            return res.status(403).json({message:"verification is not completed"});
        }
        const flag=await bcrypt.compare(password, user.password)
        if(!flag){
           return res.status(401).json({message:"Incorrect password"});
        }
        const token=jwt.sign({userId:user._id}, process.env.jwt_secretKey, {expiresIn:"2d"});
        res.status(200).json({message:"Successfull login", token:token});

    }
    catch(err){
        res.status(500).json({message:err.message});
    }

}

export const verify=async(req, res)=>{
    try{
        const verificationToken= req.params.token;
        const user= await User.findOne({verificationToken});
        if(!user){
            return res.json({message:"Invalid token"});
        }
        user.isVerified=true;
        user.verificationToken=undefined;
        await user.save();
        res.redirect(`${process.env.frontend_url}/verified?status=success`);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

export const verifiedStatus=async(req, res)=>{
    try{
        const id=req.params.id;
        const decoded_id= await jwt.verify(id, process.env.jwt_secretKey).userId;
        const user=await User.findOne({_id:decoded_id});
        res.status(200).json({flag:user.isVerified});
    }
    catch(err){
         res.status(500).json({message:err.message});
    }
}

export const forgot=async(req, res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email}).select("+password");
        const pass=await bcrypt.hash(password, 5);
        user.password=pass;
        await user.save();
        res.json({message:"Password changed"});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

export const sendOtp=async(req, res)=>{
    try{
        const {email}=req.body;
        const user=await User.findOne({email});
        if(!user){
           return res.status(404).json({message:"user doesn't exists with the email"});
        }
        const transport=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.user,
                pass:process.env.pass
            }
        })
        const chars="ABCDEabcdFG23456HIJKLRSXYZ01789eTUVWfghijklmnopqrsMNOPQtuvwxyz";
        let otp="";
        for(let i=1; i<=6; i++){
            otp+=chars.charAt(Math.floor(Math.random()*62));
        }
        user.OTP=otp;
        await user.save();
        await transport.sendMail({
            from:process.env.user,
            to:email,
            subject:"Password Reset",
            html:`<h3>Enter below otp to reset your password</h3>
            <h2>${otp}</h2>`
        })
        res.status(200).json({message:"sent otp to email"});

    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

export const verifyOTP=async(req, res)=>{
    try{
        const {otp, email}=req.body;
        const user=await User.findOne({email});
        const userOTP=user.OTP;
        if(otp!==userOTP){
            return res.status(404).json({message:"Invalid OTP"});
        }
        user.OTP=undefined;
        await user.save();
        res.status(200).json({message:"Valid OTP"});

    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

export const changePassword=async(req, res)=>{
    try{
        const {password, email}=req.body;
        const user=await User.findOne({email}).select('+password');
        const pass=await bcrypt.hash(password, 5);
        user.password=pass;
        await user.save();
        res.status(200).json({message:"Password reset done"});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

export const usersList=async(req, res)=>{
    try{
        const {token}=req.body;
        const id=jwt.verify(token, process.env.jwt_secretKey).userId;
        const users= await User.find({isVerified:true, _id:{$ne:id}}).select("name email");
        res.status(200).json({users:users});

    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}