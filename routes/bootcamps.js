const express=require('express');

const {getBootcamp,getBootcamps,createBootcamp,updateBootcamp,deleteBootcamp,getBootcampsInRadius}=require('../controllers/bootcamps');
const CourseRoute=require('./course');
const router=express.Router();

router.use('/:bootcampId/courses',CourseRoute);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);



module.exports=router;