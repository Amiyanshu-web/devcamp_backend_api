const Course=require('../models/Course')
const Bootcamp=require('../models/Bootcamp')
const ErrorResponse=require('../utils/errorResponse');
const asyncHandler=require('../middleware/asyncHandler');

//@desc         Get all bootcamps
//@route        GET api/v1/bootcamps/:bootcampId/courses
//@access       Public
exports.getCourses=
   asyncHandler(async (req,res,next)=>{
       if(req.params.bootcampId){
           const courses=await Course.find({bootcamp:req.params.bootcampId});
        res.status(200).json({
            success:true,
            count:courses.length,
            data:courses
        })
       }
       else{

        res.status(200).json(res.advancedResult);
       }
       const courses=await query;
       res.status(200).json({success:true,count:courses.length,data:courses});
   });


   //@desc         Get single  course
//@route        GET api/v1/courses/:id
//@access       Public
exports.getCourse=
   asyncHandler(async (req,res,next)=>{
      const course=await Course.findById(req.params.id).populate({
          path:'bootcamp',
          select:'name description'
      });
      if(!course){
          return next(new ErrorResponse(`Course with id ${req.params.id} not found `),404);
      }
       res.status(200).json({success:true,data:course});
   });
   //@desc         add single course
//@route        POST api/v1/bootcamps/:bootcmapId/courses
//@access       private
exports.addCourse=
   asyncHandler(async (req,res,next)=>{
      req.body.bootcamp=req.params.bootcampId;
    
    const bootcamp=await Bootcamp.findById(req.params.bootcampId);
      if(!bootcamp){
          return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found `),404);
      }
      const course=await Course.create(req.body);


       res.status(200).json({success:true,data:course});
   });
   //@desc         Update course
//@route        PUT api/v1/courses/:id
//@access       private
   exports.updateCourse=
   asyncHandler(async(req,res,next)=>{
       const course=await Course.findByIdAndUpdate(req.params.id,req.body,{
           new:true,
           runValidators:true
       })
       if(!course){
           return next(new ErrorResponse(`Course not found `),404);
       }
       res.status(200).json({success:true,data:course});
   });
   //@desc         Delete course
//@route        PUT api/v1/courses/:id
//@access       private
   exports.deleteCourse=
   asyncHandler(async(req,res,next)=>{
       const course=await Course.findById(req.params.id)
       if(!course){
           return next(new ErrorResponse(`Bootcamp not found `),404);
       }
       course.remove();
       res.status(200).json({success:true,data:{}});
   });