const express= require('express');
const mongoose = require('mongoose');
require('dotenv').config();

//Imports 
const userRoutes = require('./routes/user');

//App 
const app = express();

//DB
mongoose.connect(process.env.DATABASE , {
   useNewUrlParser:true,
   useCreateIndex:true 
}).then(() => console.log('DB Connected'));

//Routes Middlewar
app.use('/api',userRoutes);

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`This is run on port ${port}`);
});