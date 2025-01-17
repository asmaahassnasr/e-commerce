const express = require('express');
const router = express.Router();

const {requireSignin,isAdmin,isAuth} = require('../controllers/auth');

const {userById,read,update} = require('../controllers/user');


//Test Routes 
router.get('/secret/:userId',requireSignin,isAuth,isAdmin, (req,res) => {
    res.json({
        user:req.profile
    });
});

router.get("/user/:userId",requireSignin,isAuth,read);
router.put("/user/:userId",requireSignin,isAuth,update);

// Route , Controller
router.param('userId',userById);

module.exports=router;