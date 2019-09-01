const express = require('express');
require('dotenv').config();

const router = require('./routes');

const app = express();
require("./ttlIndex");

app.use('/', router);



app.listen(3000, ()=>{
    console.log("listening @", 3000);
});