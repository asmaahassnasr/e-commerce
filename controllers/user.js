const jwt = require('jsonwebtoken'); // For generation signIn Token
const expressJwt = require('express-jwt'); // for authorization Check
const User = require('../models/user');
const {errorHandler} =require('../helpers/dbErrorHandler');
exports.signup = (req, res) => {
    // console.log("req.body" , req.body);
    const user = new User(req.body) ;
    user.save((err , user) => {
        if (err) 
        {
            return res.status(400).json(
                {
                    err:errorHandler(err)
                });
        } 
        user.salt = undefined;
        user.hashedpassword = undefined;
        res.json({user});
    })
};


exports.signin =(req,res) =>{
    //find user based on email 
    const {email,password} = req.body
    User.findOne({email},(err, user) => {
        if(err || !user){
            return res.status(400).json({error:"User with that email not exist, Please SignUp"});
        }
        //If user is found , make sure email and password match 
        //create auth method
        if(!user.authenticat(password)){
            return res.status(401).json({error:"Email and password dont match"});
        }
        //generate signed token
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET);
        //process Token as t in cookie with expiry date
        res.cookie('t', token, {expire:new Date() + 9999});
        //return user and token to frontEnd
        const {_id, name,email, role} =user;
        return res.json({token, user:{_id,name,email,role}});
    })
}