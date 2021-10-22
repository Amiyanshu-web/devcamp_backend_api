//@desc Logs request to console


const logger=(req,res,next)=>{
    req.hell="King of HEll";
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}

module.exports=logger;