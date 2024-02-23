import User from "../models/user.model.js";
import AppError from '../utils/error.utils.js'
import fs from 'fs/promises'
import cloudinary from 'cloudinary'
import sendEmail from "../utils/sendEmail.utils.js";
import crypto from 'crypto'

const cookieOptions={
  maxAge:1*24*60*60*1000,//1 day
  httpOnly:true,
  secure:true
}
const register=async (req,res,next)=>{
  try {
    const {fullname,email,password}=req.body;
    if(!fullname||!email||!password)
    {
      return next(new AppError('All fields are required',400));
    }
    console.log(req.body)
    const UserExist=await User.findOne({email})
    if(UserExist)
    
      return next(new AppError('Email already exist.',400))
      
    
    const user=await User.create({
      fullname,
      email,
      password,
      avatar:{
          public_id:email,
          secure_url:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pxfuel.com%2Fen%2Fquery%3Fq%3Dsadhguru&psig=AOvVaw30pPmjJwfSauUSwa0t3rjM&ust=1695106227722000&source=images&cd=vfe&opi=89978449&ved=0CA4QjRxqFwoTCOi5vajJs4EDFQAAAAAdAAAAABAE"
      }
    })
    if(!user)
    {
      return next(new AppError('User registration failed, please try again later',400))
    }
    //profile pic (avatar) file uploading code to cloudinary

    if(req.file){
      try {
        // file upload to cloudinary
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
              folder:'lms',
              width:250,
              height:250,
              gravity:'faces',
              crop:'fill'
            })
            

            if(result){
              user.avatar.public_id=result.public_id;
              user.avatar.secure_url=result.secure_url
              //Remove file from server(saved in cloudinary)
                await fs.rm(`uploads/${req.file.filename}`)
            }
      } catch (error) {
            return next(new AppError(error||"file not uploaded.Please try again",500))
      }
    }
    await user.save();
    user.password=undefined
    const token=await user.generateJWTToken();
    res.cookie("token",token,cookieOptions)
  
    res.status(200).json({
      success:true,
      message:"User successfully registered",
      user
    })
  
  } catch (error) {
    return next(new AppError(error.message,500))
  }
  }

const login=async (req,res,next)=>{
  try {
    const { email,password }=req.body;
    if(!email||!password)
    {
      return next(new AppError('email and password are required',400))
    }
    const user=await User.findOne({
      email
    }).select('+password')
    if(!user||! await user.comparePassword(password)){
      return next(new AppError('email or password is incorrect',400))
    }
    user.password=undefined;
    const token=await user.generateJWTToken();
    res.cookie("token",token,cookieOptions)
    res.status(200).json({
      success:true,
      message:'User Loggedin successfully',
      user
    })
  } catch (error) {
    return next(new AppError(error.message,500))
  }
    
}

const logout=(req,res,next)=>{
  try {
    res.cookie('token',null,{
      secure:true,
      maxAge:0,
      httpOnly:true
    })
    res.status(200).json({
      success:true,
      message:'Logout successfully'
    })
  } catch (error) {
    return next(new AppError(error.message,500))
  }
    

}

const getProfile=async (req,res,next)=>{
   try {
        const UserId=req.user.id;
        const user=await User.findById(UserId);
        res.status(200).json({
          success:true,
          message:'Successfully get user details',
          user
        })
   } catch (error) {
    return next(new AppError('Failed to fetch user details',500))
   }

}

//forgot-password controller
const forgotPassword=async (req,res,next)=>{
       const { email }=req.body;
       if(!email)
       {
        return next(new AppError('Email is required',403))
       }
       const user=await User.findOne({email})
       if(!user)
       {
        return next(new AppError('Email is not registered',402))
       }
       const resetToken=await user.generatePasswordResetToken()
       await user.save();
       
       const resetPasswordURL=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
          //subject and message of sending email
          const subject='Reset password';
          const message=`You can reset your password by clicking <a href=${resetPasswordURL} target="_blank">Reset your password</a>\n If the above link does not work then copy paste this link in a new tab ${resetPasswordURL}`
       try {
          await sendEmail(email,subject,message)
          res.status(200).json({
            success:true,
            message:`reset password has been sent to ${email} successfully.`,
            resetUrl:resetPasswordURL
          })
       } catch (e) {
           user.forgotPasswordExpiry=undefined;
           user.forgotPasswordToken=undefined;
           await user.save()
           return next(new AppError(e.message,500))
       }

}

//reset Password controller
const resetPassword=async (req,res,next)=>{
        const {resetToken }=req.params;
        const { password }=req.body;
        const forgotPasswordToken=crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex')

          const user=await User.findOne({
            forgotPasswordToken,
            forgotPasswordExpiry:{$gt:Date.now()}
          });
          if(!user)
          {
            return next(
              new AppError("Token is invalid or expired",401)
              )
          }
          user.password=password;
          user.forgotPasswordToken=undefined;
          user.forgotPasswordExpiry=undefined;

          user.save();
          res.status(200).json({
            success:true,
            message:"password changed successfully."
          })
}
const changePassword=async (req,res,next)=>{
  try {
       const { oldPassword, newPassword }=req.body;
       const {id}=req.user;
       if(!oldPassword || !newPassword)
       {
        return next(
          new AppError("Old and new password are required",401)
          )
       }
       const user=await User.findById(id).select('+password')
       if(!user)
       {
        return next(
          new AppError("User does not exist",401)
          )
       }
       const isPasswordValid=await user.comparePassword(oldPassword)
       if(!isPasswordValid)
       {
        return next(
          new AppError("Invalid Old Password",401)
          )
       }
       user.password=newPassword;
       await user.save();
       res.status(200).json({
        success:true,
        message:"Password changed successfully"
       })
  } catch (error) {
    return next(
      new AppError(error.message,500)
      )
      
  }
}
//Update user controller code
const updateUser=async (req,res,next)=>{
  
    const {fullname}=req.body;
    const {id}=req.user;
    const user=await User.findById(id);
    if(!user)
    {
      return next(
        new AppError("User does not exist",401)
        )
    }
    if(req.fullname)
    {
      user.fullname=fullname;
    }
    if(req.file)
    {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id)
      try {
        // file upload to cloudinary
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
              folder:'lms',
              width:250,
              height:250,
              gravity:'faces',
              crop:'fill'
            })
            

            if(result){
              user.avatar.public_id=result.public_id;
              user.avatar.secure_url=result.secure_url
              //Remove file from server(saved in cloudinary)
                await fs.rm(`uploads/${req.file.filename}`)
            }
      } catch (error) {
            return next(new AppError(error||"file not uploaded.Please try again",500))
      }
    }
     await user.save()
     res.status(200).json({
      success:true,
      message:"User details updated successfully."
     })
  
}
export{
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
}