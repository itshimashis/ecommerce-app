const mongoose=require("mongoose")

const productSchema=mongoose.Schema({
     name:{
        type:String,
        required:[true,"please enter product name"]
     },
     description:{
        type:String,
        required:[true,"please enter description"]
     },
     price:{
        type:Number,
        required:[true,"please enter the price"],
        maxLength:[8,"overpriced"]
     },
     ratings:{
        type:Number,
        default:0
     },
     images:[
        {
            public_id:{
                type:String,
                required:true
            },
            public_url:{
                type:String,
                required:true
            }
         }
     ],
     category:{
        type:String,
        required:[true,"please enter product category"]
     },
     stock:{
        type:Number,
        
        default:1
     },
     numreviews:{
        type:Number,
        default:0
     },
     reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
     ],
     user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
     },
     createdAt:{
        type:Date,
        default:Date.now()
     }

})

module.exports=mongoose.model("product",productSchema)