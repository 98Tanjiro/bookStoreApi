const express = require("express");
const router = express.Router();
const {Author , validateCreateAuthor , validateUpdateAuthor} = require("../models/Author"); 
const asyncHandler = require("express-async-handler");
const {verifyTokenAndAdmin}=require("../middlewares/verifyToken");
const authors = [ 
    {
         id : 1 ,
         firstName : "kyojiro",
         lastName : "rengoku",
         nationality : " tunisia",
         image : "default-image.png",
    },
    {
        id : 2 ,
        firstName : "tanjiro",
        lastName : "kamado",
        nationality : " tunisia",
        image : "default-image1.png",
   }
];

/**
 * @description get all authors
 * @route /api/authors
 * @method get
 * @access public
 */
router.get("/", asyncHandler(
    async (req,res)=>{
     const authorList = await Author.find();
     res.status(200).json(authorList);
}));

/**
 * @description get author  By Id
 * @route /api/authors
 * @method get
 * @access public
 */
router.get("/:id", async (req,res)=>{
    const author = await Author.findById(req.params.id);
    try {
        if (author) {
            res.status(200).json(author);
        }
        else {
            res.status(404).json({message: "author not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message :"Something went wrong!!!"});
   
    }
});

 /**
  * @desc create an author
  * @route /api/authors
  * @method POST
  * @access private (only admin)
  */

router.post("/",verifyTokenAndAdmin, async (req,res)=>{
  
    const { error } = validateCreateAuthor(req.body);

    if (error){
        return res.status(400).json({message: error.details[0].message});//400  --> PROBLEM FROM CIENT
    }

try {
    const author = new Author ({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        nationality : req.body.nationality,
        image : req.body.image,
    });

    const result =  await author.save();
    res.status(201).json(result); 
} catch (error) {
    console.log(error);
    res.status(500).json({message :"something went wrong !!"});
}

 });

 /**
  * @desc Update an author
  * @route /api/authors/:id
  * @method PUT
  * @access private (only admin)
  */
 router.put("/:id",verifyTokenAndAdmin, async (req,res)=> {
    const { error } = validateUpdateAuthor(req.body);

    if (error){
        return res.status(400).json({message: error.details[0].message});//400  --> PROBLEM FROM CIENT
    }

   try {
    const author = await Author.findByIdAndUpdate(req.params.id,{
        $set:{
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            nationality : req.body.nationality,
            image : req.body.image
        }
    }, { new : true });

    res.status(200).json(author);
   } catch (error) {
      console.log(error);
      res.status(500).json({message:"something went wrong !!!"});
    
   }
 });

/**
  * @desc delete  a book
  * @route /api/authors/:id
  * @method delete
  * @access private (only admin)
  */
router.delete("/:id",verifyTokenAndAdmin,async (req,res)=> {
   try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (author){
        res.status(200).json({message: "author has been DELETED..."});
    }
    else {res.status(404).json({message: "author not found ... "})}

   } catch (error) {
    console.timeLog(error);
    res.status(500).json({message:"something went wrong !!!"});
   }
 });

 
 module.exports = router ;