const Bootcamp=require('../models/Bootcamp')
const ErrorResponse=require('../utils/errorResponse');
const asyncHandler=require('../middleware/asyncHandler');
const geocoder=require('../utils/geocoder');
//@desc         Get all bootcamps
//@route        GET api/v1/bootcamps
//@access       Public
exports.getBootcamps=
   asyncHandler(async (req,res,next)=>{
    //    console.log(req.query);
            let quer;
            //Copy req.query
            const reqQuery={...req.query};

            const removeFields=['select','sort','page','limit'];

            removeFields.forEach(param=>delete reqQuery[param]);

            //Create query string
            let queryStr=JSON.stringify(req.query);

            // Create operators ($gt,gte..etc)
            queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);

            //Finding Resource
            quer=Bootcamp.find(JSON.parse(queryStr));
            
            // select which state to show
            if(req.query.select){
                const fields=req.query.select.split(',').join(' ');
                quer=quer.select(fields);
            }

            //Sorting
            if(req.query.sort){
                 const sortBy=req.query.select.split(',').join(' ');
                 quer=quer.sort(sortBy);    //here sort is a method similar to select method above
            }else{
                quer=quer.sort('-createdAt');
            }

            //Pagination
            const page=parseInt(req.query.page,10)||1;
            const limit=parseInt(req.query.limit,10)||25;
            const startIndex=(page-1)*limit;
            const endIndex=page*limit;

            const total=await Bootcamp.countDocuments();

            quer=quer.skip(startIndex).limit(limit);


            //Executing Query
           const getBootcmp=await quer;

           const pagination={};
           if(endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
           }
           if(startIndex>0){
               pagination.prev={
                   page:page-1,
                   limit
               }
           }
           console.log(queryStr);
           
    res.status(200).json({success:true,count:getBootcmp.length,pagination,data:getBootcmp});
        
    
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