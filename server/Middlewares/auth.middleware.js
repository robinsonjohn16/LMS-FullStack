import AppError from '../utils/error.utils.js';
import jwt from 'jsonwebtoken';
const isLoggedIn=async (req,res,next)=>{
    try {
        const {token}=req.cookies;
    if(!token)
    {
        return next(new AppError('Unauthenticated, Please login..',401))
    }
    const userDetails=await jwt.verify(token,process.env.JWT_SECRET)
    req.user=userDetails;
    next()
    } catch (error) {
       res.status(500).json({
        Success:false,
        message:error.message
       })
    }
    
}

const authorizedRoles=(...roles)=>async(req,res,next)=>{
    try {
        const currentUserRole=req.user.role;
        if(!roles.includes(currentUserRole)){
            return next(
                new AppError('You are not authorized to access this operation.')
            )
        }
        next()
    } catch (error) {
        return next(
            new AppError(error.message,500)
        )
    }
}

//make middleware for checking authorised subscribers
const authorizedSubscriber=async(req,res,next)=>{
    try {
        //find subscription of the user by request
        const subscription=req.user.subscription;

        //find user current role (admin or user)
        const currentUserRole=req.user.role;

        if(currentUserRole !=='USER' || subscription.status !=='active')
        {
            return next(
                new AppError('Please subscribe the course to access this route',403)
            )
        }
        next()
    } catch (error) {
        return next(
            new AppError(error.message,500)
        )
    }
}
export{
    isLoggedIn,
    authorizedRoles,
    authorizedSubscriber
}