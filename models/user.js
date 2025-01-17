const mongoose = require('mongoose');
const crypto= require('crypto');
const uuidv1= require('uuidv1');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        maxlength:32
    },
    hashedpassword:{
        type:String,
        required:true
    },
    about:{
        type:String,
        trim:true
    },
    salt:String,
    role:{
        type:Number,
        default:0
    },
    history:{
        type:Array,
        default:[]
    }
}, {timestamps:true}
);

// Virtual Field
userSchema.virtual('password').set(function(password){
    this._password= password
    this.salt=uuidv1()
    this.hashedpassword=this.encryptPassword(password)
}).get(function (){
    return this._password
})

userSchema.methods = {

    authenticat : function(plainText){
        return this.encryptPassword(plainText)===this.hashedpassword;
    },
    encryptPassword : function(password){
        if(!password) return '';
        try{
            return crypto.createHmac('sha1',this.salt).update(password).digest('hex')
        }catch(err){
            return "Error";
        }
    }
};

module.exports = mongoose.model("User", userSchema);