const express=require('express');

const {getCourses,getCourse,addCourse,deleteCourse,updateCourse}=require('../controllers/courses');
const Course=require('../models/Course');
const AdvancedRes=require('../middleware/advancedResults');
const router=express.Router({mergeParams:true });


router.route('/').get(AdvancedRes(Course,{
            path:'bootcamp',
            select:'name description'
        })).post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);




module.exports=router;