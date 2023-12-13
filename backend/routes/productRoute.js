const express=require("express");
const { getAllProducts,crateProduct, updateProduct, deleteProduct ,getProductById} = require("../controllers/productController");
const { isAuthenticatedUser,authorizeRoles } = require("../middlewares/auth");
const { updateRole } = require("../controllers/userController");

const router=express.Router()

router.route("/products").get( getAllProducts);

router.route("/products/new").post(isAuthenticatedUser,authorizeRoles("admin"),crateProduct); //this route 
//adds a new product to the product database, so should be a admin route only feature.

router.route("admin/products/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);

router.route("/products/:id").get(getProductById);



module.exports=router