const ErrorResponse=require('../utils/errorResponse');
const asyncHandler=require('../middleware/asyncHandler');
const User=require('../models/Users');


exports.register=asyncHandler(async(req,res,next)=>{
    const {name,email,password,role}=req.body;
    const user=await User.create({
        name,email,password,role
    });
    //Create token
       sendTokenResponse(user,200,res);


})

exports.login=asyncHandler(async (req,res,next)=>{
    const {email,password}=req.body;
    
    //Validate email and pw
    if(!email||!password){
        return next(new ErrorResponse('Please provide an email and Password'),400);
    }
    //Checking user
    const user=await User.findOne({email}).select('+password');
    if(!user){
        return next(new ErrorResponse('Invalid credential'),401);
    }
    //Password check
    const isMatch=await user.matchPassword(password);
    if(!isMatch){
        return next(new ErrorResponse('Invalid credential'),401);

    }
    sendTokenResponse(user,200,res);

})
//Create cookie from token
const sendTokenResponse=(user,statusCode,res)=>{
    const token=user.getSignedJwtToken();

    const options={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000 ),
        httpOnly:true

}
if(process.env.NODE_ENV==='production'){
    options.secure=true;
}
res.status(statusCode).cookie('token',token,options).json({success:true,token})    

}
//get user details
exports.getMe=asyncHandler(async(req,res,next)=>{
     const user=await User.findById(req.user.id);
     res.status(200).json({
         success:true,data:user
     })
})