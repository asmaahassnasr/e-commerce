const User = require('../models/user');

exports.userById= (req,res,next,id) => {
    User.findById(id).exec( (err,user) =>{
        if(err || !user){
            res.status(400).json({error:"User Not Found"})
        }
        req.profile = user;
        next();
    });
}

exports.read = (req,res) =>{
    req.profile.hashedpassword = undefined;
    req.profile.salt = undefined;

    return res.json(req.profile);
}

exports.update = (req,res) =>{

    //it will find it and set updates
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true},
        (err, user) => {
            if(err ){
                res.status(400).
                json({error:"You are not authorized to perform this action "})
            }
                    
            user.hashedpassword = undefined;
            user.salt = undefined;
            res.json(user);
        });
    
}