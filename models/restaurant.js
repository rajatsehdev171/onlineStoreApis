const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//recipes schema
const recipes = new Schema({
    id: {
        type:String,
        required:true,
        unique:true
    },
    name: String,
    price: Number,
    afterDiscount: Number 
})

//restaurants schema
const restaurantSchema = new Schema({
    restaurantCode:{
        type:String,
        required:true,
        unique:true
    },
    restaurantName:String,
    location:String,
    recipes:[recipes]
})


//restaurant model
const Restaurant = module.exports =  mongoose.model('Restaurant', restaurantSchema );

// patch
module.exports.patchRestaurantByCode = (codeObject, modifiedObject, newString,  callback) => {
    Restaurant.findOneAndUpdate(codeObject, modifiedObject,  newString,  callback);
}

// add restaurant data 
module.exports.addResto = (resto, callback) => {
    resto ? resto.save(callback) : null;
}

//update single recipe by resto code and recipe id 
//this needs to be passed bcz if the match is not found 
//still says updated successfully so {upsert: true, new: true,} 
 module.exports.updateRecipe = (codeObject, recipeId, modifiedObject, options, callback) => {
     Restaurant.findOneAndUpdate(
        { restaurantCode: codeObject.restaurantCode, 'recipes.id': recipeId.id },
        { $set: { 'recipes.$.name': modifiedObject.name , 
                  'recipes.$.price':modifiedObject.price ,
                  'recipes.$.afterDiscount': modifiedObject.afterDiscount},
                 }, options, callback)
 }


//delet single recipe 
module.exports.deleteRecipe = (restoCode, recipeId, callback) => { 
    Restaurant.update({
        restaurantCode: restoCode.restaurantCode
    },{$pull :{'recipes': { "id": recipeId.id}}}, callback);
}