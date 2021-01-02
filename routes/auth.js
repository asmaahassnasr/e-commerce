const express = require('express');
const router = express.Router();

const {signup,signin,signout,requireSignin} = require('../controllers/auth');
const {userSignUpValidator,userSignIpValidator} = require('../Validator');
// Route , Controller
router.post("/signup",userSignUpValidator,signup);
router.post("/signin",userSignIpValidator,signin);
router.get("/signout",signout);

module.exports=router;