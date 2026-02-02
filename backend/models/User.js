import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationToken:{
        type:String
    },
    OTP:{
        type:String
    }
}, {timestamps:true});

export default mongoose.model("User", userSchema);