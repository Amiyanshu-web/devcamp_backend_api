const express=require('express');
const dotenv=require('dotenv');
// const logger=require('./middleware/logger')
const morgan=require('morgan');
const connectDB=require('./config/db')
const colors=require('colors');
const fileupload=require('express-fileupload')
const cookieParser=require('cookie-parser');
const path=require('path');
//Route files

const bootcamps=require('./routes/bootcamps');
const courses=require('./routes/course');
const auth=require('./routes/auth');
const users=require('./routes/users');
const ErrorHandler = require('./middleware/error');

//Load env vars

dotenv.config({path:'./config/config.env'});
connectDB();
const app=express();

//body parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Dev logging middleware

if(process.env.NODE_ENV=='development'){
    app.use(morgan('dev'));
}

app.use(fileupload());


//static folder for uplaod
app.use(express.static(path.join(__dirname,'public')));
//Mount routers
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);
app.use('/api/v1/users',users);



//MIddleware error
app.use(ErrorHandler);


const PORT=process.env.PORT || 5000;
const server=app.listen(PORT,console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode`.yellow));


//Handle Unhandle rejection


process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`.red);
    //Close Server and exit process
    server.close(()=>process.exit(1));
})
