//@desc         Get all bootcamps
//@route        GET api/v1/bootcamps
//@access       Public
exports.getBootcamps=
    (req,res,next)=>{
    res.status(200).json({success:true,msg:'Hello,show all bootcmaps'});
};
//@desc         Get id's bootcamp
//@route        GET api/v1/bootcamps/:id
//@access       Public
exports.getBootcamp=
    (req,res)=>{
    res.status(200).json({success:true,msg:`Hello,show bootcamp with id ${req.params.id}`});
};
//@desc         Create bootcamp
//@route        POST api/v1/bootcamps
//@access       Private
exports.createBootcamp=
    (req,res)=>{
    res.status(200).json({success:true,msg:'Hello,create new bootcmap'});
};
//@desc         Update bootcamp
//@route        PUT api/v1/bootcamps/:id
//@access       Private
exports.updateBootcamp=
    (req,res)=>{
    res.status(200).json({success:true,msg:`Hello,update bootcamp with id ${req.params.id}`});
};
//@desc         Delete bootcamp
//@route        api/v1/bootcamps/:id
//@access       Private
exports.deleteBootcamp=
    (req,res)=>{
    res.status(200).json({success:true,msg:`Hello,delete bootcamp with id ${req.params.id}`});
};