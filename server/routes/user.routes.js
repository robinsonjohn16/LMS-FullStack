import { Router } from "express";
import { register,login,logout,getProfile,forgotPassword,resetPassword,changePassword,updateUser } from "../Controllers/user.controller.js";
import { isLoggedIn } from "../Middlewares/auth.middleware.js";
import upload from "../Middlewares/multer.middleware.js";

const router=Router();
router.post('/register',upload.single("avatar"),register)
router.post('/login',login)
router.get('/logout',logout)
router.get('/me',isLoggedIn,getProfile)
//route for sending resetUrl(forgot Password)
router.post('/reset',forgotPassword)
//client side request for update new password(forgot Password)
router.post('/reset/:resetToken',resetPassword)
//change password for loggedin users
router.post('/changePassword',isLoggedIn, changePassword)
router.put('/update',isLoggedIn,upload.single('avatar'),updateUser)
export default router;