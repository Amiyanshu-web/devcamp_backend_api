const express=require('express');
const {register, login,getMe, forgotPassword, resetPassword,updateDetails, updatePassword}=require('../controllers/auth');

const router=express.Router();
const {protect}=require('../middleware/auth');
const { update } = require('../models/Users');
router.post('/register',register);
router.post('/login',login); 
router.get('/me',protect,getMe);
router.get('/updatedetails',protect,updateDetails);
router.get('/updatepassword',protect,updatePassword);
router.post('/forgotpassword',forgotPassword);
router.put('/resetpassword/:resettoken',resetPassword);
module.exports=router;
