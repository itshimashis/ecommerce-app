const ErrorHandler=require("../utils/errorHandler")
 module.exports=(err,req,res,next)=>{
    err.statusCode= err.statusCode || 500;
    err.message= err.message || "internal server error";


//wrong mongodb id error
  if(err.name==="CastError"){
    const message="Resource Not Found";
    err=new ErrorHandler(message,404);
    
  }
  if(err.code===11000){
      const msg=`Duplicate ${Object.keys(err.keyValue)} entered`
      err=new ErrorHandler(msg,404);
  }
  if(err.name==="JsonWebTokenError"){
    const message="Json Web Token is Invalid";
    err=new ErrorHandler(message,404);
    
  }

  if(err.name==="TokenExpiredError"){
    const message=" Web Token is Expired";
    err=new ErrorHandler(message,404);
    
  }


    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
 };