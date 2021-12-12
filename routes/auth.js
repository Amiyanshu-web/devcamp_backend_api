const express=require('express');
const {register, login,getMe, forgotPassword, resetPassword,updateDetails, updatePassword, logout}=require('../controllers/auth');

const router=express.Router();
const {protect}=require('../middleware/auth');
const { update } = require('../models/Users');
router.post('/register',register);
router.post('/login',login); 
router.get('/logout',protect,logout); 
router.get('/me',protect,getMe);
router.put('/updatedetails',protect,updateDetails);
router.put('/updatepassword',protect,updatePassword);
router.post('/forgotpassword',forgotPassword);
router.put('/resetpassword/:resettoken',resetPassword);
module.exports=router;
