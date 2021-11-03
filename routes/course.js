const express=require('express');

const {getCourse}=require('../controllers/courses');
const router=express.Router({mergeParams:true });


router.route('/').get(getCourse);



module.exports=router;