const express = require('express');
const router = express.Router();

const {SayHi} = require('../controllers/user');

// Route , Controller
router.get("/", SayHi);

module.exports=router;