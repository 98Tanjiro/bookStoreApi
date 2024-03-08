const { default: mongoose } = require("mongoose");


async function connectToDb()
{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongoDB...");
    } catch (error) {
        console.log("Connection failed to MongoDB!",error);
        
    }
    
}

// mongoose.connect(process.env.MONGO_URI)
//         .then(()=>console.log("Connected to mongoDB..."))
//         .catch((error)=> console.log("Connection failed to MongoDB!",error));


module.exports = 
{
    connectToDb
};