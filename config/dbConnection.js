require("dotenv").config();

const mongoose=require("mongoose");

const ConnectDB = async() => {
   try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB connected")
   } catch (error) {
    console.log(error);
    
   }
    
}

module.exports = {ConnectDB}