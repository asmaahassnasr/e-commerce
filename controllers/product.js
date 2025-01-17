const {errorHandler} =require('../helpers/dbErrorHandler');
const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.productById = (req, res, next , id) => {
    Product.findById(id).exec( (err, product) =>{
        if(err || !product){
            return res.status(400).
            json({error:"Product not found"});
        }
        req.product = product;
        next();
    });
};


exports.read = (req,res) =>{
    //dont send photo in each request because of big size
    req.product.photo = undefined;
    return res.json(req.product);
}


exports.create = (req , res) => {
    let form = new formidable.IncomingForm(); // all available data here
    form.keepExtensions = true; // All Extensions
    form.parse(req, (err, fields,files) =>{
        
        if(err) {
            return res.status(400).
            json({error:"Iamge could not be uploaded"});
        }

        const {name, description,price,category,quantity,shipping} = fields;
        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({error:"All Fields are required"});
        }


        let product = new Product(fields);

        if(files.photo){
            
            //if file is greater than 1 mb 
            if(files.photo.size > 1000000){
            return res.status(400).json({error:"Iamge Should be less than 1 MB"});
            }

            
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType= files.photo.type;
        }

        product.save( (err, result) =>{
            if(err){
                return res.status(400).json({error:errorHandler(err)})
            }

            res.json(result);
        })

    });
}

exports.remove = (req,res) =>{
    let product = req.product;
    product.remove((err,deleteProduct) => {
        if(err){
            return res.status(400).
            json({error:errorHandler(err)});
        }
        res.json({
            deleteProduct,
            "message":'Product Deleted Successfuly'
        });
    });
}

exports.update = (req , res) => {

    let form = new formidable.IncomingForm(); // all available data here
    form.keepExtensions = true; // All Extensions
    form.parse(req, (err, fields,files) =>{
        
        if(err) {
            return res.status(400).
            json({error:"Iamge could not be uploaded"});
        }

        const {name, description,price,category,quantity,shipping} = fields;
        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({error:"All Fields are required"});
        }

        let product = req.product; // because we already have a product
        product = _.extend(product,fields); // to take new fields

        if(files.photo){
            
            //if file is greater than 1 mb 
            if(files.photo.size > 1000000){
            return res.status(400).json({error:"Iamge Should be less than 1 MB"});
            }
            
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType= files.photo.type;
        }

        product.save( (err, result) =>{
            if(err){
                return res.status(400).json({error:errorHandler(err)})
            }

            res.json(result);
        })

    });
}



// sell / arrival  .... from front end
//  By sell = /products?sortBy=sold&order=desc&limit=4
//  By arrival = /products?sortBy=createdAdd&order=desc&limit=4
// if no paramas are send , then all products are returned


exports.list = (req,res) =>{
    let  order = req.query.order ? req.query.order : 'asc' ;
    let  sortBy = req.query.sortBy ? req.query.sortBy : '_id' ;
    let  limit = req.query.limit ? parseInt(req.query.limit) : 6 ;

    Product.find().
    select("-photo")
    .populate('category')
    .sort([[sortBy,order]])
    .limit(limit)
    .exec( (err, products) => {
        if(err) {
            return res.status(400).
            json({error: "Products not found"});
        }
        res.json(products);
    });
}


//it will find products based on request product category
//other products that has the same category will be return

exports.listRelated = (req , res) =>{
    let  limit = req.query.limit ? parseInt(req.query.limit) : 6 ;
    
    //find all exept this one (not includede)

    Product.find({_id: {$ne: req.product} , category:req.product.category}).
    limit(limit)
    .populate('category','_id name')
    .exec( (err , products) => {
        if(err) {
            return res.status(400).
            json({error: "Products not found"});
        }
        res.json(products);
    })
}


//Get All Categories wich have a products related to it 

exports.listCategories = (req,res) =>{
    Product.distinct("category", {}, (err , categories) => {
        if(err) {
            return res.status(400).
            json({error: "Products not found"});
        }
        res.json(categories);
    })
}


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};


exports.photo = (req,res ,next) =>{
    if(req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}