const express = require("express");
const router = express.Router(); 
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {User , validateUpdateUser}= require("../models/User");
const {verifyTokenAndAuthorization, verifyTokenAndAdmin}=require("../middlewares/verifyToken");

/**
 * @description update  user
 * @route /api/users/:id
 * @method put
 * @access private
 */
router.put("/:id", verifyTokenAndAuthorization , asyncHandler(async(req,res)=>{


    const {error} = validateUpdateUser(req.body);
    if (error){
        return res.status(400).json({message:error.details[0].message});
    }

    

    if (req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password,salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set : {
            eamil : req.body.eamil, 
            password : req.body.password,
            username : req.body.username
        }
    },{new : true}).select("-password");

    res.status(200).json(updatedUser);

}));

/**
 * @description get all  users
 * @route /api/users
 * @method get
 * @access private(only admin)
 */
router.get("/", verifyTokenAndAdmin , asyncHandler(async(req,res)=>{
    const users = await User.find().select("-password");
    res.status(200).json(users);

}));

/**
 * @description get user by id
 * @route /api/users/:id
 * @method get
 * @access private(only admin & user himself)
 */
router.get("/:id", verifyTokenAndAuthorization , asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id).select("-password");
   if (user) {
    res.status(200).json(user);}
    else { res.status(404).json({message : " user not found ...!"});}

}));

/**
 * @description delete user 
 * @route /api/users/:id
 * @method delete
 * @access private(only admin & user himself)
 */

router.delete("/:id", verifyTokenAndAuthorization , asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id).select("-password"); 
   if (user) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({message : "User have been deleted successfully ...!"});}
    else { res.status(404).json({message : " Oops there is an issue ...!"});}

}));

module.exports = router ;