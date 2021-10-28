const Bootcamp=require('../models/Bootcamp')
const ErrorResponse=require('../utils/errorResponse');
const asyncHandler=require('../middleware/asyncHandler');
//@desc         Get all bootcamps
//@route        GET api/v1/bootcamps
//@access       Public
exports.getBootcamps=
   asyncHandler(async (req,res,next)=>{
       
           const getBootcmp=await Bootcamp.find();
    res.status(200).json({success:true,count:getBootcmp.length,data:getBootcmp});
        
    
});
//@desc         Get id's bootcamp
//@route        GET api/v1/bootcamps/:id
//@access       Public
exports.getBootcamp=
      asyncHandler(async (req,res,next)=>{

   
           const getIdBootcmp=await Bootcamp.findById(req.params.id);
           if(!getIdBootcmp){
           return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)); //if id is not correctly formated

           }
    res.status(200).json({success:true,data:getIdBootcmp});
      
});
//@desc         Create bootcamp
//@route        POST api/v1/bootcamps
//@access       Private
exports.createBootcamp=
      asyncHandler(async (req,res,next)=>{

       
            const Bootcmp=await Bootcamp.create(req.body);
    res.status(201).json({success:true,data:Bootcmp});
        
        
});
//@desc         Update bootcamp
//@route        PUT api/v1/bootcamps/:id
//@access       Private
exports.updateBootcamp=

       asyncHandler(async (req,res,next)=>{

            const updBootcmp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!updBootcmp){
                     return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)); //if id is not correctly formated


           }
    res.status(200).json({success:true,data:updBootcmp});
        
        
});
//@desc         Delete bootcamp
//@route        api/v1/bootcamps/:id
//@access       Private
exports.deleteBootcamp=
       asyncHandler(async (req,res,next)=>{

         const delBootcmp=await Bootcamp.findByIdAndDelete(req.params.id);

        if(!delBootcmp){
                      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)); //if id is not correctly formated


           }
    res.status(200).json({success:true,data:{}});
       
});