import User from "../models/user.model.js";
import Payment from '../models/payment.model.js'
import { razorpay } from "../server.js";
import AppError from "../utils/error.utils.js";
import crypto from 'crypto';

//Find razorpayy APi key
export const getRazorpayApiKey=(req,res,next)=>{
    try {
         res.status(200).json({
        Success:true,
        message:'Razorpay API Key',
        Key:process.env.RAZORPAY_KEY_ID
    })
    } catch (error) {
        return next(
            new AppError(error.stack,500)
        )
    }
   
}

//Buy subscription of course by an student 
export const buySubscription=async(req,res,next)=>{
    try {
        const {id}=req.user;
        const user=await User.findById(id)
        if(!user)
        {
         return next(
             new AppError('Unauthenticated Access.Please login',404)
         )
        }
        if(user.role==='ADMIN')
        {
         return next(
             new AppError('Admin can not purchase any course',404)
         )
        }
        const subscription=await razorpay.subscriptions.create({
         plan_id:process.env.RAZORPAY_PLAN_ID,
         customer_notify:1
        })
        user.subscription.id=subscription.id;
        user.subscription.status=subscription.status;
        await user.save();
        res.status(200).json({
            Success:true,
            message:'Subscribed successfully',
            Subscription_id:subscription.id
        })
    } catch (error) {
        return next(
            new AppError(error.stack,500)
        )
    }
   
}

//verify subscription and make sure that payment was happened in the razorpay
export const verifySubscription=async(req,res,next)=>{
   try {
        
       const {id}=req.user;
       const {razorpay_payment_id,razorpay_signature,razorpay_subscription_id}=req.body;
       const user=await User.findById(id)
       if(!user)
       {
        return next(
            new AppError('Unauthorised Access.Please Login.',404)
        )
       }
       //find subscription id from user model object
       const subscriptionId=user.subscription.id;

       //genertae crypto signature
       const generatedSignature=crypto
            .createHmac('sha256',process.env.RAZORPAY_SECRET)
            .update(`${razorpay_payment_id}|${subscriptionId}`)
            .digest('hex')
            
        if(generatedSignature!==razorpay_signature)
        {
            return next(
                new AppError('Payment is not verified.Please try again.',404)
            )
        }
       await Payment.create({
         razorpay_payment_id,
         razorpay_signature,
         razorpay_subscription_id
       })
       //set user subscription status to active
       user.subscription.status='active';
       await user.save();
       res.status(200).json({
        Success:true,
        message:'Payment verified successfully'
       })
                
   } catch (error) {
       return next(
        new AppError(error.stack,500)
       )
   }
}

//cancel subscription by the student
export const cancelSubscription=async(req,res,next)=>{
    try {
        const {id}=req.user;
        const user=await User.findById(id)
        if(!user)
        {
         return next(
             new AppError('Unauthenticated Access.Please login',404)
         )
        }
        if(user.role==='ADMIN')
        {
         return next(
             new AppError('Admin can not cancel any subscription',404)
         )
        }
        const subscriptionId=user.subscription.id;
        const subscription=await razorpay.subscriptions.cancel(subscriptionId)
        //set user information subscription status 
        user.subscription.status=subscription.status;
        await user.save();
        res.status(200).json({
            Success:true,
            message:'Subscribed successfully',
            Subscription_id:subscription.id
        })
    } catch (error) {
        return next(
            new AppError(error.stack,500)
        )
    }
}

//find all payments by the admin
export const allPayments=async(req,res,next)=>{
   try {
        const {count}=req.query;
        const subscriptions=await razorpay.subscriptions.all({
            count:count||10
        })
        res.status(200).json({
            Success:true,
            message:"All payments",
            subscriptions
        })
   } catch (error) {
     return next(
        new AppError(error.stack,500)
     )
   }
}