const express=require('express');

const {getCourses,getCourse,addCourse,deleteCourse,updateCourse}=require('../controllers/courses');
const Course=require('../models/Course');
const AdvancedRes=require('../middleware/advancedResults');
const router=express.Router({mergeParams:true });
const {protect,authorize}=require('../middleware/auth');


router.route('/').get(AdvancedRes(Course,{
            path:'bootcamp',
            select:'name description'
        })).post(protect,authorize('publisher','admin'),addCourse);
router.route('/:id').get(getCourse).put(protect,authorize('publisher','admin'),updateCourse).delete(protect,authorize('publisher','admin'),deleteCourse);




module.exports=router;