const mongoose=require('mongoose');
const slugify=require('slugify');
const geocoder=require('../utils/geocoder');
const BootcampSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name'],
        unique:true,
        trim:true,           //remove whitespaces
        maxlength:[50,"Name can not be more than 50 characters"]
    },
    slug:String,    //Useful for frontend to import name 
    description:{
        type:String,
        required:[true,'Please add a description'],
        unique:true,
        trim:true,           //remove whitespaces
        maxlength:[500,"Description can not be more than 50 characters"]
    },
    website:{
        type:String,
        match:[/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    'Please use valid URL']
    },
    phone:{
        typr:String,
        // maxlength:[10,'Max Length exceeded']
    },
    email:{
        type:String,
        match:[/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ,'Please add valid email address'
        ]
    },
    address:{
        type:String,
        required:[true,'Please add an address']
    },
    location:{
        //GeoJSON POint
        type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: false
    },
    coordinates: {
      type: [Number],
      required: false,
      index:'2dSphere'
    },
    formattedAddress:String,
    street:String,
    city:String,
    state:String,
    zipcode:String,
    country:String,

    },
    careers:{
        type:[String],
        required:true,
        enum:[
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating:{
        type:Number,
        min:[1,'Rating must be atleast 1 '],
        max:[10,'Rating can not be more than 10']
    },
    avergaeCost:Number,
    photo:{
        type:String,
        default:'no-photo.jpg'
    },
     housing:{
        type:Boolean,
        default:false
    },
     jobAssistance:{
        type:Boolean,
        default:false
    },
     jobGurantee:{
        type:Boolean,
        default:false
    },
    acceptGi:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

});
//Slug from anme
BootcampSchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true});
    next();
});
//Geocode And create location
    BootcampSchema.pre('save',async function(next){
        const loc=await geocoder.geocode(this.address);
        this.location={
            type:'Point',
            coordinates:[loc[0].longitude,loc[0].latitude],
            formattedAddress:loc[0].formattedAddress,
            street:loc[0].streetName,
            city:loc[0].city,
            state:loc[0].stateCode,
            zipcode:loc[0].zipcode,
            country:loc[0].countryCode
        }
        //dont send address in DB
        this.address=undefined;
        next();
});
module.exports=mongoose.model('Bootcamp',BootcampSchema);