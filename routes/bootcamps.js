const express=require('express');

const {getBootcamp,getBootcamps,createBootcamp,updateBootcamp,deleteBootcamp,getBootcampsInRadius, bootcampPhotoUpload}=require('../controllers/bootcamps');
const CourseRoute=require('./course');
const ReviewRoute=require('./reviews');
const Bootcamp=require('../models/Bootcamp');
const advancedResult=require('../middleware/advancedResults');
const router=express.Router();

const {protect,authorize}=require('../middleware/auth');
router.use('/:bootcampId/courses',CourseRoute);
router.use('/:bootcampId/reviews',ReviewRoute);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/:id/photo').put(protect,authorize('publisher','admin'),bootcampPhotoUpload);

router.route('/').get(advancedResult(Bootcamp,'courses'),getBootcamps).post(protect,authorize('publisher','admin'),createBootcamp);
router.route('/:id').get(getBootcamp).put(protect,updateBootcamp).delete(protect,authorize('publisher','admin'),deleteBootcamp);



module.exports=router;