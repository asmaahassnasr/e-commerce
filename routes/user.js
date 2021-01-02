const express = require('express');
const router = express.Router();

const {signup} = require('../controllers/user');

// Route , Controller
router.post("/signup", signup);

module.exports=router;