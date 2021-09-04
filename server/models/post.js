const mongoose = require('mongoose')
const {objectId} = mongoose.Schema.Types.ObjectId

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        required:true,
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

mongoose.model("Post",postSchema)