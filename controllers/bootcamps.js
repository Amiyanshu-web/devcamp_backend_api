const Bootcamp=require('../models/Bootcamp')

//@desc         Get all bootcamps
//@route        GET api/v1/bootcamps
//@access       Public
exports.getBootcamps=
   async (req,res,next)=>{
       try {
           const getBootcmp=await Bootcamp.find();
    res.status(200).json({success:true,count:getBootcmp.length,data:getBootcmp});
       } catch (error) {
           res.status(400).json({success:false})
       }
    
};
//@desc         Get id's bootcamp
//@route        GET api/v1/bootcamps/:id
//@access       Public
exports.getBootcamp=
   async (req,res,next)=>{
   try {
           const getIdBootcmp=await Bootcamp.findById(req.params.id);
           if(!getIdBootcmp){
           return res.status(404).json({success:false}) //if id is not correctly formated

           }
    res.status(200).json({success:true,data:getIdBootcmp});
       } catch (error) {
           res.status(404).json({success:false})
       }
};
//@desc         Create bootcamp
//@route        POST api/v1/bootcamps
//@access       Private
exports.createBootcamp=
    async (req,res,next)=>{
        try {
            const Bootcmp=await Bootcamp.create(req.body);
    res.status(201).json({success:true,data:Bootcmp});
        } catch (error) {
            res.status(500).json({success:false})
        }
        
};
//@desc         Update bootcamp
//@route        PUT api/v1/bootcamps/:id
//@access       Private
exports.updateBootcamp=

    async (req,res)=>{
        try {
            const updBootcmp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!updBootcmp){
           return res.status(400).json({success:false}) //if id is not correctly formated

           }
    res.status(200).json({success:true,data:updBootcmp});
        } catch (error) {
         return res.status(400).json({success:false}) 

        }
        
};
//@desc         Delete bootcamp
//@route        api/v1/bootcamps/:id
//@access       Private
exports.deleteBootcamp=
    async (req,res)=>{
        try {
         const delBootcmp=await Bootcamp.findByIdAndDelete(req.params.id);

        if(!delBootcmp){
           return res.status(400).json({success:false}) //if id is not correctly formated

           }
    res.status(200).json({success:true,data:{}});
        } catch (error) {
         return res.status(400).json({success:false}) 

        }
};