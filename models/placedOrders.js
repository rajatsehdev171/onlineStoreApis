const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//ordered recipes schema 
const orderedRecipes = new Schema({
    id: String,
    name: String,
    price: Number,
    count:Number,
    afterDiscount: Number
});

//placed orders records schema
const placedOrders = new Schema({
    restaurantCode:{type:String, required:true, unique:false},
    personOrderedFood: String,
    personCode: {
        type:String,
        required:true
    },
    nearByAgentLocation: String,
    nearByAgentTrackableCode: String,
    orderLocationAddress: String,
    orderedRecipes: [orderedRecipes],
    totalPayment:Number,
    paymentType: String,
    paymentStatus: String,
    deliveryStatus: {type:String, default:'ordered'}
});

// module.exports = mongoose.model('OrderedRecipes', orderedRecipes);

//placed ordered records model
const PlacedOrders = module.exports = mongoose.model('PlacedOrders', placedOrders);

module.exports.placeOrder = (orderedObject, callback) => {
    orderedObject ? orderedObject.save(callback) : null ;  
}

//find orders of a particular restaurant
module.exports.getRestoOrders = (restoCode, options, callback) => {
    let deliverStatusArray = ["ordered","wayToShop"] ;
    PlacedOrders.find({ $and:[{restaurantCode: restoCode , deliveryStatus:{$in: deliverStatusArray}}]}, options, callback);
}

//find placed orders for the person ordered food
module.exports.getOrdersPlacedByPerson = (restoCode, personCode, callback) => {
 PlacedOrders.find({ $and:[{restaurantCode: restoCode.restaurantCode , personCode:personCode.personCode}]}, callback);

}