const ErrorResponse=require('../utils/errorResponse');
const ErrorHandler=(err,req,res,next)=>{
    let error={...err};
    error.message=err.message;
    console.log(err.stack.red);
//Monggose bad object
    if(err.name==='CastError'){
        const message=`Resource not found with id of ${err.value}`;
        error=new ErrorResponse(message,404);
    }
    //Mongoose duplicate key
     if(err.code===11000){
        const message=`Duplicate field value entered`;
        error=new ErrorResponse(message,400);
    }
    //Validation error
    if(err.name==='ValidationError'){
        const message=Object.values(err.errors).map(val=>val.message);
        error=new ErrorResponse(message,400);
    }

    res.status(error.statusCode  || 500).json({success:false,Error:error.message||"Server Error"});
}

module.exports=ErrorHandler;
