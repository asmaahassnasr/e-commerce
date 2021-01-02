const {errorHandler} =require('../helpers/dbErrorHandler');
const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
exports.create = (req , res) => {
    let form = new formidable.IncomingForm(); // all available data here
    form.keepExtensions = true; // All Extensions
    form.parse(req, (err, fields,files) =>{
        
        if(err) {
            return res.status(400).json({error:"Iamge could not be uploaded"});
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

