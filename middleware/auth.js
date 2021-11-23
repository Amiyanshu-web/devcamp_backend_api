const jwt=require('jsonwebtoken');
const asyncHandler=require('./asyncHandler');
const ErrorResponse=require('../utils/errorResponse');
const User=require('../models/Users');
const dotenv=require('dotenv');
dotenv.config({path:'./config/config.env'}); 

//Protect Routes
exports.protect=asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1]; //Split after space(here after bearer) and take 2nd index(i.e. auth token) 
    }
    // else if(req.cookies.token){
    //     token=req.cookies.token
    // }

    //Make sure token exist
    if(!token){
        return next(new ErrorResponse('Not authorized to access this route',401));
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        req.user=await User.findById(decoded.id);
        next();
    }catch(err){
        return next(new ErrorResponse('Not authorized to access this route',401));

    }
})

//Grant access to specific role
exports.authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is not authorize to access this route`),403);
        }
        next();
    }
}