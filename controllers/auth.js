const ErrorResponse=require('../utils/errorResponse');
const asyncHandler=require('../middleware/asyncHandler');
const User=require('../models/Users');
const sendEmail = require('../utils/sendEmail');
const crypto=require('crypto')
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
//log out user to clear token
// GET api/v1/auth/logout
//Private route

exports.logout=asyncHandler(async (req,res,next)=>{
    res.cookie('token','none',{
        expires:new Date(Date.now()+10*1000),
      httpOnly:true
    })
    res.status(200).json({
         success:true,data:{}
     })

})

//get user details
exports.getMe=asyncHandler(async(req,res,next)=>{
     const user=await User.findById(req.user.id);
     res.status(200).json({
         success:true,data:user
     })
})

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails=asyncHandler(async(req,res,next)=>{
  const fieldsToUpdate={
    name:req.body.name,
    email:req.body.email
  }


     const user=await User.findByIdAndUpdate(req.user.id,fieldsToUpdate,{
       
      new:true,
      runValidators:true
     });
     res.status(200).json({
         success:true,data:user
     })
})

exports.updatePassword=asyncHandler(async(req,res,next)=>{

     const user=await User.findById(req.user.id).select('+password');
     //check password
     if(!user.matchPassword(req.body.CurrentPassword)){
       return next(new ErrorResponse('Entered Password is incorrect',401));
     } 

     user.password=req.body.newPassword;
     user.save();
    sendTokenResponse(user,200,res);     
})
// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});
// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resetToken
// @access    Private
exports.resetPassword=asyncHandler(async(req,res,next)=>{
    //Get hashed token
    const resetPasswordToken=crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user=await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}});
    if(!user){
    return next(new ErrorResponse('Invalid Token', 400));

    };
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
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