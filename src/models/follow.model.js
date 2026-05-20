const mongoose = require('mongoose');

const follwSchema = new mongoose.Schema({
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true ,"follwer is required"]
    },
    following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true ,"follwer is required"]
    },
    status:{
        type:String,
        default:"pending",
        enum:{
            values:["pending","accepted","rejected"],
            message:"status can only be pending,accepted or rejected"
        }
    }

},
    {
        timestamps:true
    }
)
follwSchema.index({follower:1,following:1},{unique:true})

const followModel = mongoose.model("follow",follwSchema)

module.exports = followModel