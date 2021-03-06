const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/instagram-clone31/image/upload/v1631101425/R_1_bdi3ad.png"
    },
    followers:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    following:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]
})

mongoose.model("User",userSchema);