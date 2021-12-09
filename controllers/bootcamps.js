const path=require('path');
const Bootcamp=require('../models/Bootcamp')
const ErrorResponse=require('../utils/errorResponse');
const asyncHandler=require('../middleware/asyncHandler');
const geocoder=require('../utils/geocoder');
const advancedResult = require('../middleware/advancedResults');
const dotenv=require('dotenv');
dotenv.config({path:'./config/config.env'});
//@desc         Get all bootcamps
//@route        GET api/v1/bootcamps
//@access       Public
exports.getBootcamps=
   asyncHandler(async (req,res,next)=>{
    
           
    res.status(200).json(res.advancedResult);
        
    
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

       req.body.user=req.user.id;
       //Checked for published bootcamp
       const publishedBootcamp=await Bootcamp.findOne({user:req.user.id});
        
       //If user is not admin ,he can only create one bootcamp
        if(publishedBootcamp && req.user.role!='admin'){
            return next(new ErrorResponse(`The user with id ${req.user.id} has already published a bootcamp`),400);

        }

            const Bootcmp=await Bootcamp.create(req.body);
    res.status(201).json({success:true,data:Bootcmp});
        
        
});
//@desc         Update bootcamp
//@route        PUT api/v1/bootcamps/:id
//@access       Private
exports.updateBootcamp=

       asyncHandler(async (req,res,next)=>{

            let updBootcmp=await Bootcamp.findById(req.params.id);
        if(!updBootcmp){
                     return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)); //if id is not correctly formated


           }
           //Check if user is publisher or admin then only he can update
           if(updBootcmp.user.toString()!==req.user.id && req.user.role!=='admin' ){
                     return next(new ErrorResponse(`Not Authorized to update the bootcamp`,401)); 

           }
           updBootcmp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
    res.status(200).json({success:true,data:updBootcmp});
        
        
});
//@desc         Delete bootcamp
//@route        api/v1/bootcamps/:id
//@access       Private
exports.deleteBootcamp=
       asyncHandler(async (req,res,next)=>{

         const delBootcmp=await Bootcamp.findById(req.params.id);

        if(!delBootcmp){
                      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)); //if id is not correctly formated


           }
           //Check if user is publisher or admin then only he can delete
           if(delBootcmp.user.toString()!==req.user.id && req.user.role!=='admin' ){
                     return next(new ErrorResponse(`Not Authorized to delete the bootcamp`,401)); 

           }
           delBootcmp.remove();
    res.status(200).json({success:true,data:{}});
       
});

//@desc         PhotoUpload bootcamp
//@route        PUT api/v1/bootcamps/:id/photo
//@access       Private
exports.bootcampPhotoUpload=
       asyncHandler(async (req,res,next)=>{

         const bootcmp=await Bootcamp.findById(req.params.id);

        if(!bootcmp){
                      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)); //if id is not correctly formated


           }
            if(bootcmp.user.toString()!==req.user.id && req.user.role!=='admin' ){
                     return next(new ErrorResponse(`Not Authorized to update the bootcamp`,401)); 

           }
        if(!req.files){
            return next(new ErrorResponse('Please upload the file'),400);
        }

        //Make sure only image is uploaded
        const file=req.files.file;
        if(!file.mimetype.startsWith('image')){
             return next(new ErrorResponse('Please upload a valid image file'),400);
        }
        //Check file size
        if(file.size>process.env.FILE_MAX_SIZE){
             return next(new ErrorResponse(`File Size exceeded max size limit of ${process.env.FILE_MAX_SIZE} `),400);

        }

        //Create custom file name
        file.name=`photo_${req.params.id}${path.parse(file.name).ext}`;
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err=>{
            if(err){
                console.error(err);
                return next(new ErrorResponse('Error with file Uplaod'),500);
            }
            await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name});
            res.status(200).json({
                success:true,
                data:file.name
            });
        });
});

//@desc         GET bootcamp
//@route        GET api/v1/bootcamps/radius/:zipcode/:distance
//@access       Private
exports.getBootcampsInRadius=
       asyncHandler(async (req,res,next)=>{
    
        const {zipcode,distance}=req.params;
        //geocoder to get lat,lon

        const loc=await geocoder.geocode(zipcode);
        const lat=loc[0].latitude;
        const lng=loc[0].longitude;

        console.log("lng"+lng);
        //calc radius using radians
        //divide distance by radius of earth(3963 miles)

        const radius=distance/3963;

        const bootcamps=await Bootcamp.find({
            location:{
      $geoWithin: { $centerSphere: [ [ lng,lat ], radius ] }
   }
}); 


        res.status(200).json({
            success:true,
            count:bootcamps.length,
            data:bootcamps
        })
         
       
});