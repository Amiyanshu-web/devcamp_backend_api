const express=require('express');

const {getBootcamp,getBootcamps,createBootcamp,updateBootcamp,deleteBootcamp,getBootcampsInRadius, bootcampPhotoUpload}=require('../controllers/bootcamps');
const CourseRoute=require('./course');
const Bootcamp=require('../models/Bootcamp');
const advancedResult=require('../middleware/advancedResults');
const router=express.Router();

router.use('/:bootcampId/courses',CourseRoute);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/:id/photo').put(bootcampPhotoUpload);

router.route('/').get(advancedResult(Bootcamp,'courses'),getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);



module.exports=router;