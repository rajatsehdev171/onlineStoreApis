const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const restaurants = require('./routes/restaurants');
const placedOrders = require('./routes/placedOrders');
const config = require('./config/database');

console.log("this is config",config.database);

mongoose.connect(config.database, { useNewUrlParser: true });

mongoose.connection.on('connected', ()=>{
    console.log("connected to database.."+config.database)
});

mongoose.connection.on('err', ()=>{
    console.log("connected to database.."+err)
});

const app = express();

const port = 2000;

app.use(cors());

// app.use(express.static(path.join(__dirname, public)))

app.use(bodyParser.json());

//other routes 
app.use('/foodRestaurants', restaurants);
app.use('/orders', placedOrders);

//index route 
app.get('/', (req, res)=>{
  res.send("this is sending object hii..");
})
app.listen(port, ()=>{
    console.log("this is server start!!");
})



