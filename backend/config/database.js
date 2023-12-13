const mongoose=require("mongoose")
const connectDB=()=>{
    mongoose.connect(process.env.DBURL).then((data)=>console.log(`mongodb connected at ${data.connection.host}`))
    //.catch((err)=>console.log("error",err));
}

module.exports=connectDB