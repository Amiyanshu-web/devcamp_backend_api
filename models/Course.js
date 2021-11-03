const mongoose=require('mongoose');
const CourseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title cannot be empty"],
         trim:true,   

    },
    description:{
        type:String,
        required:[true,"Title cannot be empty"],

    },
     weeks:{
        type:String,
        required:[true,"Please add number of weeks"],
         trim:true,

    },
    tuition:{
        type:Number,
        required:[true,"Please add tuition cost"]
    },
    minimumSkill:{
        type:String,
        required:true,
        enum:['beginner','intermediate','advanced']
    },
    scholarshipAvailable:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    }

    

});
module.exports=mongoose.model('Course',CourseSchema);
