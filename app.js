const express= require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

//Imports 
const authRoutes = require('./routes/auth');

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

//Routes Middlewar
app.use('/api',authRoutes);

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`This is run on port ${port}`);
});