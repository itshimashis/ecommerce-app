const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const crypto=require("crypto")
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter Name"],
        maxLength:[30,"cannot exceed 30 charecters"]
    },
    email:{
        type:String,
        required:[true,"please enter email address"],
        unique:true,
        validate:[validator.isEmail,"Please enter valid Email address"]

    },
    password:{
        type:String,
        required:[true,"please enter the password"],
        minLength:[8,"password should be atleast 8 charceters long"],
        select:false,
    },
    avatar: {
        public_id: {
          type: String,
          required: false,
        },
        url: {
          type: String,
          required: false,
        },
      },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,


});
userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next();
    }
    this.password= await bcrypt.hash(this.password,10);
})
//

//JWT tokens

userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.jwt_secret,{expiresIn:'2d'});
};

userSchema.methods.comparePassword=async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};


userSchema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");


    //HAshing and adding to the user schema
    
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire=Date.now()+15*60*1000;

    return resetToken;

}

module.exports=mongoose.model("User",userSchema);
