const app=require("./app")

const connectDB=require("./config/database")

const dotenv=require("dotenv")
dotenv.config({path:"backend/config/config.env"})

connectDB()


//uncaught exception handling
process.on("uncaughtException",(err)=>{
    console.log(`error bacuse ${err.message}`)
});


const server=app.listen(process.env.PORT,()=>{
    console.log(`server running at port ${process.env.PORT}`)
})
//unhandled promise error
process.on("unhandledRejection",err=>{
    console.log(`unhandled promise rejection`)
    console.log("server stopped")
    server.close(()=>{
        process.exit(1);
    })
})