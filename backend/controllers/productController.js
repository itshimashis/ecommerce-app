
const Product=require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
 const AsyncErrorHandler=require("../middlewares/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

exports.crateProduct= AsyncErrorHandler(async(req,res,next)=>{
  req.body.user=req.user.id;
  const product =await Product.create(req.body)
  res.status(201).json({
    seccess:true,
    product
  })
})

exports.getAllProducts=AsyncErrorHandler(async (req,res)=>{
  const resultPerpage=3;

//const productCount= await Product.countDocuments();

  const apiFeature=new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerpage);
  const fetchedProduct=await apiFeature.query;
  res.status(200).json(fetchedProduct);
})

exports.updateProduct= AsyncErrorHandler( async (req,res,next)=>{
    const id=req.params.id
   let product=await Product.findById(id);
   if(!product){
   return  next(new ErrorHandler("not found",404));
   }
   product=await Product.findByIdAndUpdate(id,req.body,{new:true},{runValidators:true},{useFindAndModify:false});


   res.status(200).json({
       success:true,
       product
   }
   )
})


exports.deleteProduct= AsyncErrorHandler( async(req,res,next)=>{
   const product=await Product.findById(req.params.id);
   if(!product){
      return next(new ErrorHandler("not found",404));
   }
   await product.deleteOne(); //do not use product.remove() here doesn't work

   res.status(200).json({
    success:true,
    message:"successfully deleted product"
   })
});

exports.getProductById= AsyncErrorHandler (async (req,res,next)=>{
    const product= await Product.findById(req.params.id);
    if(!product){
      return next(new ErrorHandler("not found",404));
    }
    res.status(200).json({
      success:true,
      product,
      
     })

})

//Create new review or update the review


