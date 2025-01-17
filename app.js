const express= require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

//Imports 
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

//App 
const app = express();

//DB
mongoose.connect(process.env.DATABASE , {
   useNewUrlParser:true,
   useCreateIndex:true 
}).then(() => console.log('DB Connected'));

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
//To Handle Requestes comming from different origins or PORTS
app.use(cors());

//Routes Middlewar
app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`This is run on port ${port}`);
});