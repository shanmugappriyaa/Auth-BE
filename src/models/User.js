const mongoose = require('./index')

const validateEmail = (e)=>{
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(e); 
}

const userSchema = new mongoose.Schema({
  
    userName:{type:String,required:[true,"Name is Required"]},
    email:{type:String,required:[true,"Email is Required"],validate:validateEmail},
    password:{type:String,required:[true,"Password is Required"]},
    OTP:{type:String,default:""}
},{
    versionKey:false
})

const userModel = mongoose.model('users',userSchema)
module.exports = userModel