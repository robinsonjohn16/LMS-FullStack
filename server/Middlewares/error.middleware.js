const errorMiddleware=(err,req,res,next)=>{

    err.statusCode=err.statusCode||500 //if statusCode is not specified in controller then default statuscode
    err.message=err.message||"Something went wrong" //if message is not specified in the controller

    res.status(err.statusCode).json({
        Success:false,
        message:err.message,
        stack:err.stack
    })
}
export default errorMiddleware;