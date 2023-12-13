const express=require("express")
const middleware=require("./middlewares/error")
const cookieParser=require("cookie-parser")
const app=express()

app.use(express.json())
app.use(cookieParser())
//we have to add the routes in our app
const product=require("./routes/productRoute");
const user=require("./routes/userRoutes");

app.use("/api/v1",product);
app.use("/api/v1",user);

//middlewares for error handling

app.use(middleware)

module.exports=app