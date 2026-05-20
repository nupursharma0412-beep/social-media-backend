const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    img:{
        type:String,
        required:[true,"image is required"]
    },
    user:{
        ref:"User",
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"user id is required for creating an post"]
    }

})

const postModel = mongoose.model("post",postSchema)

module.exports = postModel