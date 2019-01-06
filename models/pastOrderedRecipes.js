const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderedRecipes = require('./placedOrders');

//past ordered records schema
const pastOrderedRecords = new Schema({
    restaurantCode:{
        type:String,
        required:true
    },
    personOrderedFood: String,
    orderCode: String,
    nearByAgentLocation: String,
    nearByAgentTrackableCode: String,
    orderLocationAddress: String,
    orderedRecipes: [orderedRecipes],
    paymentType: String,
    paymentStatus: String,
    deliveryStatus: String
});

//past ordered records model
const PastOrderedRecords = module.exports = mongoose.model('pastOrderedRecords', pastOrderedRecords);