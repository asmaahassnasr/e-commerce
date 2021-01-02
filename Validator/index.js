exports.userSignUpValidator = (req,res,next ) =>{
    req.check('name', 'Name is required ').notEmpty();
    req.check('email',' Email is required').
    matches(/.+\@.+\..+/).
    withMessage('Email Must contain @').
    isLength({min:4 , max:32});

    req.check('password','Password is Required').notEmpty();
    req.check('password').isLength({min:6,max:20}).withMessage('pass must at least 6 Characters').
    matches(/\d/).withMessage('Password must contain a number');
    const errors= req.validationErrors();
    if(errors){
        const firstError = errors.map(er => er.msg)[0];
        return res.status(400).json({error:firstError});
    }
    next ();
}