const express = require("express");
const logger = require ("./middlewares/logger");
const {notFound,errorHandler} = require("./middlewares/errors");
const dotenv = require("dotenv").config();
const { connectToDb } = require("./config/db");


//CONNECTION TO DATABASE
connectToDb();


//init app
const app = express();

//apply middlewares
app.use(express.json());
app.use(logger);


// Routes
app.use("/api/books",require("./routes/books"));
app.use("/api/authors",require ("./routes/authors"));
app.use("/api/auth",require ("./routes/auth"));
app.use("/api/users",require ("./routes/users"));

//error handling middlewares

app.use(notFound);

app.use(errorHandler);




// running a server
const PORT = process.env.PORT ||5000 ; 
app.listen(PORT,()=>console.log(`server is running in ${process.env.NODE_ENV} on port ${PORT}`));