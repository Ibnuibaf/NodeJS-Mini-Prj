import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    image:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    blocked:{
        type:Boolean,
        default:false
    }
})

const userModel=mongoose.model("User",userSchema)

export default userModel