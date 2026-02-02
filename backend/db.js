import mongoose from "mongoose";

export  const db=async()=>{
    try{
        await mongoose.connect(process.env.mongo_URI);
        console.log("connected to mongoose");
    }
    catch(err){
        console.log("Not connected", err)
    }  
}