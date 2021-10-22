const express=require('express');
const dotenv=require('dotenv');
// const logger=require('./middleware/logger')
const morgan=require('morgan');
const connectDB=require('./config/db')
const colors=require('colors');
//Route files

const bootcamps=require('./routes/bootcamps');

//Load env vars

dotenv.config({path:'./config/config.env'});
connectDB();
const app=express();

//Dev logging middleware

if(process.env.NODE_ENV=='development'){
    app.use(morgan('dev'));
}

// app.use(logger);

//Mount routers
app.use('/api/v1/bootcamps',bootcamps);


const PORT=process.env.PORT || 5000;
const server=app.listen(PORT,console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode`.yellow));


//Handle Unhandle rejection


process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`.red);
    //Close Server and exit process
    server.close(()=>process.exit(1));
})
