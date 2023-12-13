const ErrorHandler = require("../utils/errorHandler")
const crypto=require("crypto")
 const AsyncErrorHandler=require("../middlewares/catchAsyncError");

 const User=require("../models/usermodel");
const sendToken = require("../utils/jwttoken");

const sendEmail=require("../utils/sendEmail");
exports.registerUser= AsyncErrorHandler(async (req,res,next)=>{
    const {name,email,password}=req.body;
    const user= await User.create({
        name,
        email,
        password,
        avatar:{
            publicId:"this is the id",
            url:"ProfilePicUrl"
        }
    })
    sendToken(user,201,res);
});

//--------USER LOGIN FEATURE----------\\
exports.loginUser= AsyncErrorHandler( async (req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return next(new ErrorHandler("Bad request", 401));
    }

    const user = await User.findOne({ email }).select("+password"); //finding a user with 
//that email and password;

if(!user){
    return next(new ErrorHandler("Invalid email or passowrd",401));
}
const isPasswordMatched=await user.comparePassword(password);

if(!isPasswordMatched){
    return next(new ErrorHandler("Invalid email or password",401))
}
/*const token=user.getJWTToken();
res.status(200).json({
    success:true,
    token,
})*/
sendToken(user,200,res);

});


//------USER_LOGOUT_FEATURE-------\\

exports.logOut=AsyncErrorHandler(async(req,res,next)=>{

res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true
});
  

res.status(200).json({
    success:true,
    message:"logged out successsfully"
})

})

///-----FORGOT PASSWORD FEATURE---------\\\\

exports.forgotPassowrd=AsyncErrorHandler(async (req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("Email not found",404));

    }
   const resetToken= user.getResetPasswordToken();

   await user.save({validateBeforeSave:false});

   const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

   const message=`your passwpord reset token is ${resetPasswordUrl}. If you have not requested this Email
   please ignore it`;

   try {
    
     await sendEmail({
          email:user.email,
          subject:"store password recovery",
          message,
     })
     res.status(200).json({
        success:true,
        message:`email sent to ${user.email} successfully`
     })

   } catch (error) {
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save({validateBeforeSave:false});
    return next(new ErrorHandler(error.message,500));
   }
})


exports.resetPassword= AsyncErrorHandler(async(req,res,next)=>{
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user=await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}});
    if(!user){
        return next(new ErrorHandler("Reset Password token is invalid or has beeen expired",400));
    }
    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler("Passwords do not match",404))
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
    sendToken(user,200,res);

});

exports.getUserDetails=AsyncErrorHandler(async(req,res,next)=>{
    const user=await User.findById(req.user.id); //seeing one's own profile
    //searching from database or any other 3rd party api fetching should always
    //be a async/await thing. await lagana mandatory hain
    res.status(200).json({
        success:true,
        user
    })

})

//update User's Password:
exports.updatePassword=AsyncErrorHandler(async(req,res,next)=>{
   const user=await User.findById(req.user.id).select("+password");//because this feature available only if
   //that User is alreay logged in
   const isPasswordMatched=await user.comparePassword(req.body.oldPassword);
   if(!isPasswordMatched){
    return next(new ErrorHandler("old Password Has been expired",400));
}
if(req.body.newPassword!==req.body.confirmPassword){
    return next(new ErrorHandler("passwords do not match",401));
}
user.password=req.body.newPassword;
 await user.save();
 sendToken(user,200,res);

})

//Update Other Details Apart from Password

exports.updateDetails=AsyncErrorHandler(async(req,res,next)=>{
    const user=await User.findById(req.user.id);//because this feature available only if
 

    //now that his password has been verified let's take the new details from him
    //and save accordingly
    const {newName,newEmail}=req.body;
    user.name=newName;
    user.email=newEmail;
  await user.save();
   res.status(200).json({
    success:true,
    message:"Result Sent Successfully"
   })
 
 })
//admin route to get all the users;
 exports.getAllUsers=AsyncErrorHandler(async (req,res,next)=>{
    const allusers=await User.find();
    res.status(200).json({
        success:true,
        allusers
    })
 })

 //admin route to get details of any specific user

 exports.getUserById=AsyncErrorHandler(async (req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    res.status(200).json({
        success:true,
        user
    })
 })


//to change someone's role (like admin or user)
//this should also be accessible through admin routes

 exports.updateDetails=AsyncErrorHandler(async(req,res,next)=>{
    const user=await User.findById(req.user.id);//because this feature available only if
 

    //now that his password has been verified let's take the new details from him
    //and save accordingly
    const {newName,newEmail}=req.body;
    user.name=newName;
    user.email=newEmail;
  await user.save();
   res.status(200).json({
    success:true,
    message:"Result Sent Successfully"
   })
 
 })


 exports.updateRole=AsyncErrorHandler(async(req,res,next)=>{
    const user=await User.findById(req.user.id);//because this feature available only if
 

    //now that his password has been verified let's take the new details from him
    //and save accordingly

    user.role=req.body.newRole;
  await user.save();
   res.status(200).json({
    success:true,
    message:"Result Sent Successfully"
   })
 
 })



 //delete user route

 exports.delteuser=AsyncErrorHandler(async(req,res,next)=>{


    const user=await User.findById(req.user.id);
    if(!user){
        return next(new ErrorHandler("User doesnot exist",404));
    }
     await User.findByIdAndDelete(req.user.id);//because this feature available only if
 

    //now that his password has been verified let's take the new details from him
    //and save accordingly

    
   res.status(200).json({
    success:true,
    message:"Deleted Successfully"
   })
 
 })
