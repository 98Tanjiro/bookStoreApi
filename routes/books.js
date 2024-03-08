const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {validateCreateBook,validateUpdateBook,Book} = require("../models/Book");
const {verifyTokenAndAdmin}=require("../middlewares/verifyToken");

/**
 * @description get all books
 * @route /api/books
 * @method get
 * @access public
 */
router.get("/",asyncHandler(async (req,res)=>{
    const books = await Book.find().populate("author",["firstName" , "lastName"]);
    res.status(200).json(books);
}));

/**
 * @description get book  By Id
 * @route /api/books
 * @method get
 * @access public
 */
router.get("/:id",asyncHandler(async(req,res)=>{
    const book = await Book.findById(req.params.id).populate("author",["firstName" , "lastName"]);
    if (book) {
        res.status(200).json(book);
    }
    else {
        res.status(404).json({message: "book not found"});
    }
}));

 /**
  * @desc create a book
  * @route /api/books
  * @method POST
  * @access private (only admin)
  */

router.post("/",verifyTokenAndAdmin,asyncHandler(async(req,res)=>{
  
    const { error }= validateCreateBook(req.body);

    if (error){
        return res.status(400).json({message: error.details[0].message});//400  --> PROBLEM FROM CIENT
    }

    const book = new Book ({
        title : req.body.title,
        author : req.body.author,
        description : req.body.description,
        price : req.body.price,
        cover : req.body.cover,
    })
        
    

    const result = await book.save()
    res.status(201).json(result); 

 }));

 /**
  * @desc Update a book
  * @route /api/books/:id
  * @method PUT
  * @access private (only admin)
  */
 router.put("/:id",verifyTokenAndAdmin,asyncHandler(async(req,res)=> {
    const { error } = validateUpdateBook(req.body);

    if (error){
        return res.status(400).json({message: error.details[0].message});//400  --> PROBLEM FROM CIENT
    }

   const updatedBook=await Book.findByIdAndUpdate(req.params.id,{
    $set:{
        title : req.body.title,
        author : req.body.author,
        description : req.body.description,
        price : req.body.price,
        cover : req.body.cover
    }
   },{new : true});
   res.status(200).json(updatedBook);

 }));

/**
  * @desc delete  a book
  * @route /api/books/:id
  * @method delete
  * @access private (only admin)
  */
router.delete("/:id",verifyTokenAndAdmin,asyncHandler(async(req,res)=> {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (book){

        res.status(200).json({message: "book has been DELETED..."});
    }
    else {res.status(404).json({message: "book not found ... "})}

 }));


 module.exports = router;