const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({

    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post",
        required:[true,"post id is required"]
    },
    user:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"user",
    }
},{
    timestamps:true
})

likeSchema.index({post:1 , user:1},{unique:true})

const likeModel = mongoose.model("likes",likeSchema)

module.exports = likeModel