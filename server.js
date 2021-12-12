const express=require('express');
const dotenv=require('dotenv');
// const logger=require('./middleware/logger')
const morgan=require('morgan');
const connectDB=require('./config/db')
const colors=require('colors');
const fileupload=require('express-fileupload')
const cookieParser=require('cookie-parser');
const path=require('path');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
//Route files

const bootcamps=require('./routes/bootcamps');
const courses=require('./routes/course');
const auth=require('./routes/auth');
const users=require('./routes/users');
const reviews=require('./routes/reviews');
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

//sanitize
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//xss-injection prevnt
app.use(xss());

//Rate limiting,limit number of req per user in spoecific time 
const limiter=rateLimit({
    windowMs:10*60*1000,   //10 mins
    max:100
})
app.use(limiter);
//hpp
app.use(hpp());

//cors
app.use(cors());

//static folder for uplaod
app.use(express.static(path.join(__dirname,'public')));
//Mount routers
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);
app.use('/api/v1/users',users);
app.use('/api/v1/reviews',reviews);



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
