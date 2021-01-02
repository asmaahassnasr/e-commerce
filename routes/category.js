const express = require('express');
const router = express.Router();

const {create, categoryById , read ,remove ,update, list} = require('../controllers/category');
const {requireSignin,isAdmin,isAuth} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.get("/category/:categoryId",read);

router.post("/category/create/:userId",requireSignin,isAdmin,isAuth,create);

router.delete("/category/:categoryId/:userId",requireSignin,isAdmin,isAuth,remove);

router.put("/category/:categoryId/:userId",requireSignin,isAdmin,isAuth,update);

router.get("/categories", list);


router.param('categoryId',categoryById);
router.param('userId',userById);

module.exports=router;