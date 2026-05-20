const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username :{
        type:String,
        unique:[true,'username is already exist'],
        required:[true,'username is require']
    },
    email:{
        type:String,
        unique:[true,'email is already exist'],
        required:[true,'email is require']
    },
    password:{
        type:String,
        required:[true,'password is require'],
        select:false
    },
    bio:String, 
    profile:{
        type:String,
        default:"https://th.bing.com/th/id/OIP.dDKYQqVBsG1tIt2uJzEJHwHaHa?w=206&h=206&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3"
    }
})
const userModel = mongoose.model('User',userSchema)

module.exports = userModel