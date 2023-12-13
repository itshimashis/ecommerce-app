const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt=require("jsonwebtoken");
const User=require("../models/usermodel");


exports.isAuthenticatedUser=catchAsyncError(async (req,res,next)=>{
     const {token}=req.cookies;
     console.log(token);
     if(!token){
        return next(new ErrorHandler("please login to access this resource",401));
     }
      
     const decodeData=jwt.verify(token,process.env.jwt_secret);
     req.user=await User.findById(decodeData.id);

//** This middleware basically modifies the request and adds custom item in the request**/

     next();
})

exports.authorizeRoles=(...roles)=>{
   return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
       return next( new ErrorHandler("Role is not allowed to access this resource",403));
    }
    next();
   };
};
