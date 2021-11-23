const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv');
dotenv.config({path:'./config/config.env'});
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter a name']
    },
     email:{
        type:String,
        match:[/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ,'Please add valid email address'
        ],
        required:[true,"Please eneter valid email"],
        unique:true
    },
    role:{
        type:String,
        enum:['publisher','user'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,"Please enter passord"],
        minlength:6,
        select:false//to show password or not
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }

});
//Encrypt passord using bcrypt
UserSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);

    next();
});
//Sign JWT and return
UserSchema.methods.getSignedJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRATION_TIME
    });
}
//Match password enetrd to password in database
UserSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

module.exports=mongoose.model('User',UserSchema);
