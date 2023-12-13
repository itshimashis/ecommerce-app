const express=require("express");
const { registerUser, loginUser, logOut, forgotPassowrd ,resetPassword, getUserDetails, updatePassword, updateDetails, getAllUsers, getUserById, updateRole, delteuser} = require("../controllers/userController");
const { isAuthenticatedUser ,authorizeRoles} = require("../middlewares/auth");

const router =express.Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/password/forgot").post(forgotPassowrd)

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logOut);

router.route("/me").get( isAuthenticatedUser ,getUserDetails);


router.route("/password/update").put(isAuthenticatedUser ,updatePassword);

router.route("/me/updateProfile").put(isAuthenticatedUser ,updateDetails);

router.route("/admin/getAllUsers").get(isAuthenticatedUser ,authorizeRoles("admin"),getAllUsers);

router.route("/admin/getuserById/:id").get(isAuthenticatedUser ,authorizeRoles("admin"),getUserById);


router.route("/admin/updateRole/:id").put(isAuthenticatedUser ,authorizeRoles("admin"),updateRole);

router.route("/admin/deleteUser/:id").put(isAuthenticatedUser ,authorizeRoles("admin"),delteuser);


module.exports=router;