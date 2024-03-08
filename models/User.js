const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");

//user schema 
const UserSchema = new mongoose.Schema ({
    email : {
        type:String ,
        required : true ,
        trim : true ,
        minlength : 5 ,
        maxlength : 100 ,
        unique : true,
    },
    username : {
        type:String ,
        required : true ,
        trim : true ,
        minlength : 2 ,
        maxlength : 200 ,
    },
    password : {
        type:String ,
        required : true ,
        trim : true,
        minlength : 5 
    },
    isAdmin : {
        type:Boolean ,
        default : false 
    },

},{timestamps : true});

//generate token 
UserSchema.methods.generateToken = function(){
    return jwt.sign({ id : this._id ,isAdmin : this.isAdmin},process.env.JWT_SECRET_KEY);
}

 // user model 
 const User = mongoose.model("User",UserSchema);

 // validate register  user 
 function validateRegisterUser (obj){
    const schema = joi.object({
        email : joi.string().trim().min(5).max(100).required().email(),
        username : joi.string().trim().min(2).max(200).required(),
        password : joi.string().trim().min(6).required(),
    });
    return schema.validate(obj);
 }

 //validate login user 
 function validateLoginUser (obj){
    const schema = joi.object({
        email : joi.string().trim().min(5).max(100).required().email(),
        password : joi.string().trim().min(6).required()
    });
    return schema.validate(obj);
 }

 // validate update user 
 function validateUpdateUser (obj){
    const schema = joi.object({
        email : joi.string().trim().min(5).max(100).email(),
        username : joi.string().trim().min(2).max(200),
        password : joi.string().trim().min(6),
    });
    return schema.validate(obj);
 }
 module.exports =  {
    User,
    validateRegisterUser,
    validateLoginUser, 
    validateUpdateUser
 }