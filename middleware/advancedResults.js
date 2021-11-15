const advancedResult=(model,populate)=>async (req,res,next)=>{
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
            quer=model.find(JSON.parse(queryStr));
            
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

            const total=await model.countDocuments();

            quer=quer.skip(startIndex).limit(limit);

            if(populate){
                quer=quer.populate(populate);
            }

            //Executing Query
           const results=await quer;

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
           res.advancedResult={
               success:true,
              count:results.length,pagination,data:results   
           }
           next();

}
module.exports=advancedResult;