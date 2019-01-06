const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const PlacedOrders = require('../models/placedOrders');
const Agent = require('../models/agent');

/*
*Routes related to placed orders
*/
router.post('/placedOrders', (req,res, next) => {
   console.log("this is order params", req.body);
    //instantiate new restaurant object
    let newOrder = new PlacedOrders({
        restaurantCode: req.body.restaurantCode,
        personOrderedFood: req.body.personOrderedFood,
        personCode: req.body.personCode,
        nearByAgentLocation: req.body.nearByAgentLocation,
        nearByAgentTrackableCode: req.body.nearByAgentTrackableCode,
        orderLocationAddress: req.body.orderLocationAddress,
        orderedRecipes: req.body.orderedRecipes,
        totalPayment: req.body.totalPayment,
        paymentType: req.body.paymentType,
        paymentStatus: req.body.paymentStatus,
        deliveryStatus: req.body.deliveryStatus 
    });
    console.log("this is new orderr object---",newOrder);
    PlacedOrders.placeOrder(newOrder, (err, order)=>{
      if(err){
          res.json({success:false, msg:"order not placed!!"+err})
          return next();
      }
      res.json({success:true, msg:"order placed successfully!!"+order})
    });

})


//making separate api for resto owner and order maker to fetch placed orders
//get orders for  restaurant owner
router.get('/myRestoOrders/restoCode:restoCode', (req, res, next) => {
    
  const restoCode =  req.params.restoCode.replace(/:/g,'');
  PlacedOrders.getRestoOrders(restoCode, {upsert: true, new: true}, (err, response)=>{
    if(err){
        res.json({success:false, msg:"error fetching orders "+err});
        return next();
    }
    if(response.length === 0){
        res.json({success:false, msg:" orders with ordered status delivered not found"});
        return next();
    }
    else{
        res.json({success:true, msg:"orders fetched successfully!!"+response});
    }
  })

})

//on clicking start tracking order button asyn call this api with setInterval function from frontend to
// get status and location  of agent
router.get('/myRestoOrders/myorders:restoCode&&:personCode', (req, res, next) => {
    const  [restoCode, personCode]  = [{restaurantCode:req.params.restoCode.replace(/:/g,'')}, {personCode:req.params.personCode.replace(/:/g,'')}];
    PlacedOrders.getOrdersPlacedByPerson(restoCode, personCode, (err, response) => {
        if(err){
            res.json({success:false, msg:"error fetching orders"+err})
        }
        if(response.length === 0){
            res.json({success:false, msg:"orders not found"})
        }
        else{
            //assign nearest agent according to the restaurant location
            console.log("this is response***",response); 
            console.log("this is resto location***",response[0].restaurantCode); 
            Restaurant.find({restaurantCode:response[0].restaurantCode}, (err, result) => {
                    if(err){
                       res.json({success:false, msg:"cannot find the restaurant details with restoCode in restaurants model"})
                    }
                    if(result.length > 0){

                        
                        //getting restaurant location from restaurant model
                        //****now i have resto deatils in result and placed order detail inside response variables 
                        console.log(`this is restaurants details using track order ${result[0].restaurantName} ${result[0].location}`);

                        //assign this response a near by agent if it doesnt have 
                        //one taking into consideration resto location and orderrrs location
                        
                            if(!response.nearByAgentLocation && !response.nearByAgent){
                                //** calculate distances of diffrent agents from resto location and assign it a agent 
    
    
                                // **using restaurant location assign nearby agent result[0].location
                               
                               
                                const agentNew = new Agent({
                                    nearByAgentLocation: 'lat: 28.7495° N, long:77.0565° E',
                                    nearByAgentTrackableCode: 'hraishchand1234',
                                }) 
                                Agent.addAgent(agentNew, (err, savedAgent) => {
                                    if(err) console.log("this is error in saving agent object");
                                    console.log("this is saved agent---",savedAgent);

                                })

                                // **save this agent with agentForThisResponse in placedOrders object
                                
    
    
                                //
    
                                
                            }
                       
                        Agent.find({nearByAgentTrackableCode:'hraishchand1234'}, (err , agent) => {
                            if(err) {
                                res.json({success:false, msg:"agent with trackable code not found!!"});
                                return next();
                            }
                            else{
                                console.log("this is agents location when it is tracked",agent[0].nearByAgentLocation)
                                
                                //now the positon of agent loaction willchange on each hit to api 

                                //save that position in  with delivery status in placeorder model in accordance with agent position
                                //from resto location and then resto  location to ordere's location and send back the response 
                                res.json({success:true, msg:"agent with trackable code fetched successfully!!"+result});
                            }
                            
                        })

                       
                       
                    }
            });
           
            
        }
    })
})


module.exports = router;