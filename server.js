const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const router = require('./api');

const app = express();
require("./ttlIndex");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use('/api', router);



app.listen(3000, ()=>{
    console.log("listening @", 3000);
});