const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');


/*
*Routes related to restaurants
*/
//get list of restaurants registered 
router.get('/listFoodShops:newCode', ( req, res ) => {
    const string = req.params.newCode.replace(/:/g,'') ;
    if( string === 'rajat123'){
        Restaurant.find({}, function(err, results){
            if(err) res.json({success:false, msg:"cannot fetch retaurants list"+err})
            res.json({success:true, msg:"fetched results successfully"+results})
        })
    }
   else res.json({success:false, msg:"not matching fetch code"});
 
})

//update single recipe restaurant object by recipe id and resto code 
router.put('/restaurantDetails:restCode&&:recipeId', (req, res)=>{
    // Restaurant.
    const  [restoCode, recipeId]  =[{restaurantCode:req.params.restCode.replace(/:/g,'')}, {id:req.params.recipeId.replace(/:/g,'')}];
    Restaurant.updateRecipe(restoCode , recipeId , req.body, {upsert: true, new: true}, (err , updated)=>{
        if(err){
            console.log(err);
            res.json({success:false, msg:'recipe not updated'+err});
        }
        else{
         res.json({success:true, msg:'recipe updated successfully!!@ '});
        }
    });

})

//posting restaurant data by clicking 
router.post('/postRestaurant', (req, res)=>{

    //instantiate new restaurant object
    let newRestaurant = new Restaurant({
        "restaurantName": req.body.restaurantName,
        "restaurantCode": req.body.restaurantCode,
        "location": req.body.location,
        "recipes": req.body.recipes
    });
   
    //calling in instance method to save new object using mongoose save()
    Restaurant.addResto(newRestaurant, (err, resto)=>{
       if(err){
           console.log(err);
           res.json({success:false, msg:'resto not added !!@'+err});
       }
       else{
        res.json({success:true, msg:`resto added !!@ ${resto}`});
       }
    })
})

//update restaurant data 
router.patch('/updateRestaurantDetails:restaurantCode', (req, res)=>{
    const string = req.params.restaurantCode;
    const param = string.replace(/:/g,'');
    const  array = [{ restaurantCode:param }, { $set:req.body}, {new :false}];
    
    //calling  restaurant update method
    Restaurant.patchRestaurantByCode(...array, (err, updateResto)=>{
    if(err){
        console.log("this is update error++++"+err);
        res.json({success:false, msg:'resto not updated !!@'+err});
    }
    else{
        console.log("this is got docs++"+updateResto);
        res.json({success:true, msg:`resto updated successfully !!@ ${updateResto}`});
    }
 });

})

//delete recipes using  restaurantCode and recipe id
router.delete('/deleteUnwantedRecipes:restaurantCode&&:id',(req,res) => {
    const  [restoCode, recipeId]  =[{restaurantCode:req.params.restaurantCode.replace(/:/g,'')}, {id:req.params.id.replace(/:/g,'')}];
    Restaurant.deleteRecipe(restoCode, recipeId, (err, deletedRecipe) => {
        if (err) {
            res.json({success:false,msg:`not deleted !! ${err}`});
        }
        else{
            res.json({success:true, msg:"deleted successfully!!!"});
        }
    });
      
})


module.exports = router;