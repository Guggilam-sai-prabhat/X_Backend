import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name :{
        require: true,
        type: String
    },
    username :{
        require: true,
        type: String,
        unique : true
    },
    email :{
        require: true,
        type: String,
        unique : true
    },
    password :{
        require: true,
        type: String
    },
    bookmarks :{
        type: Array,
        default : []
    },
    followrs :{
        type: Array,
        default : []
    },
    following :{
        type : Array,
        default : []
    }
} ,  {timestamps: true})


export const User =  mongoose.model("User",userSchema)