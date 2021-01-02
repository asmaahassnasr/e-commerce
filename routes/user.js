const express = require('express');
const router = express.Router();

const {signup,signin,signout} = require('../controllers/user');
const {userSignUpValidator,userSignIpValidator} = require('../Validator');
// Route , Controller
router.post("/signup",userSignUpValidator,signup);
router.post("/signin",userSignIpValidator,signin);
router.post("/signout",signout);

module.exports=router;