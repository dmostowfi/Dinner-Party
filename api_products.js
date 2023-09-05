//
// app.get('/products/:category', async (req, res) => {...});
//
// return product details for specific category from Open Food Facts API
// reference: https://openfoodfacts.github.io/api-documentation/#jump-3SEARCHRequests-SearchforUSbreakfastcereals
//

var express = require('express');
var router = express.Router();


/* GET search */
router.get('/', function(req, res, next) {

    try {

    console.log("call to /search...");

    ///////////////////////extract data for fetch API//////////////////////////
    
    category = req.query.category;
    console.log(req.query.allergens)
    console.log(req.query.preferences)
    
    allergens_param = req.query.allergens
    //error handling
    //if 0 allergens entered, create empty list
    if(allergens_param === undefined){var user_allergens = []}
    //this is for when the allergens are sent from a new party
    else if (typeof allergens_param === 'string' && allergens_param.includes(",")){
      var user_allergens = allergens_param.split(', ');}
    //if 1 allergen entered, push element to empty list
      else if (typeof allergens_param === 'string'){
      var user_allergens = []
      user_allergens.push(allergens_param)}
    //else, rename to user_allergens
    else{
      var user_allergens = allergens_param
    }
    
    excludeTraces = req.query.excludeTraces
    if (excludeTraces === 'on'){
      excludeTraces = true
    }
    else{excludeTraces = false}
    
    preferences_param = req.query.preferences
    //error handling if 0-1 preferences entered
    if(preferences_param === undefined){var user_preferences = []}
    //this is for when the preferences are sent from a new party
    else if (typeof preferences_param === 'string' && preferences_param.includes(",")){
      var user_preferences = preferences_param.split(', ');}
    else if (typeof preferences_param === 'string'){
      var user_preferences = []
      user_preferences.push(preferences_param)}
    else{
      var user_preferences = preferences_param
    }

    
    console.log(category)
    console.log(user_allergens) 
    console.log(excludeTraces) 
    console.log(user_preferences) 


    ///////////////////////connect to OFF API//////////////////////////
        const offendpoint = 'https://world.openfoodfacts.org/cgi/search.pl';
        //for worldwide results, replace 'us' with 'world'

        const queryParams = new URLSearchParams({
            action: 'process',
            tagtype_0: 'categories',
            tag_0: category,
            tag_contains_0: 'contains',
            json: 1,
            });
        
        const url = `${offendpoint}?${queryParams}`;
        console.log(url)
    
        //If you want to add more criteria to the query, increase the number of the tag. For example:
        //tagtype_1=label
        //tag_contains_1=contains
        //tag_1=kosher
        //Link: https://openfoodfacts.github.io/api-documentation/#collapse-5Filtering-SEARCHparameters
    
    //step 3: async call to OFF API - return promise we'll wait on eventually
   
    console.log("/products: calling Open Food Facts...");
  
    fetch(url)
      .then(response => {
        //checks if response is outside of 200-299 range
        if (!response.ok) {
          console.log(response) 
          return response.text()
                .then(htmlText => {
                  console.log('Raw HTML response:', htmlText);
                  res.render('error', {msg:'The server timed out. Please try your search again'})
                  //throw new Error('Network response was not ok');
                });
        }
        return response.json()
      })
      .then(data => {
        //retrieve all products from OFF for the given category
        var off_data_products = data['products'];

        //filter for allergens and to a list
        var product_results = []; //start with empty list of results 
        var page_size = 10 //limit 10 results per page
        var products_i = 0 //count number of iterations

        //iterate through results from OFF
        productLoop: for (const item of off_data_products) {
          
          var allergen_present = false
          var traces_present = false
          var labels_tag = true
          products_i = products_i + 1
          console.log('i=', products_i) //num iterations should match # results
          
          //check if product_name or allergens_hierarchy doesn't exist
          if (
            item['product_name'] === undefined || //or
            item['allergens_hierarchy'] === undefined ||
            item['labels_hierarchy'] === undefined){
            //
            //checking that we're skipping over undefined elements
            //console.log('list length:', product_results.length)
            //console.log(item['product_name'])
            //console.log(item['allergens_hierarchy'])
            //console.log(item['labels_hierarchy'])
            continue // move to next element in productLoop
          }

          checkallergenLoop: for (const allergen of user_allergens){
            if( //if product's allergen list contains any user-entered allergens 
              item['allergens_hierarchy'].includes(allergen))
              //item['labels_hierarchy'].includes(allergen)  
            {
              allergen_present = true
              console.log(allergen_present)
              break checkallergenLoop; //don't need to iterate through all allergens
            }
            else if (
              excludeTraces === true && //and
              item['traces_hierarchy'].includes(allergen)){
              traces_present = true
              console.log(traces_present)
            }
          }

          checkpreferencesLoop: for (const pref of user_preferences){
            console.log('pref:', pref)
            //console.log(item['labels_hierarchy'])
            if( //if labels_hierarchy does not include 'vegan'
              !item['labels_hierarchy'].includes(pref)){
              labels_tag = false
              //console.log(labels_tag)
              //console.log(item['labels_hierarchy'])
            }
          }
          
          if (
            allergen_present === true || 
            traces_present === true ||
            labels_tag === false) {
            continue productLoop; //go to next item in project loop
          }
          
          const {_id, allergens_hierarchy, labels_hierarchy, traces_hierarchy, product_name, ingredients_text} = item; // Extract desired properties
          
          const struct = {
            _id,
            product_name,
            ingredients_text,
            allergens_hierarchy,
            traces_hierarchy,
            labels_hierarchy,
            category
            };
  
          product_results.push(struct);
          
          //console.log('list length:', product_results.length) // checking that list is growing
  
          //break out of forEach once we hit page limit
          if (product_results.length >= page_size){
            console.log("breaking out of productloop")
            break productLoop;
          }
  
        }; //productLoop

        console.log(product_results)
        console.log("results length", product_results.length)
        console.log("/search done, sending response...");
        if (product_results.length===0 && !req.session.userid){
          res.render('results', { productList: 0, category: category, isLoggedin: 'false' });
        }
        else if (product_results.length===0 && req.session.userid){
          res.render('results', { productList: 0, category: category, isLoggedin: 'true', username: req.session.username});
        }
        else if(req.session.userid && req.session.party){
            res.render('results', { productList: product_results, category: category, isLoggedin: 'true', party:req.session.party, username: req.session.username})
            console.log(req.session.party)
          }
        else if(req.session.userid && !req.session.party){
            res.render('results', { productList: product_results, category: category, isLoggedin: 'true', username: req.session.username})
          }
        else{
            res.render('results', { productList: product_results, category: category, isLoggedin: 'false' })
          }
      })//then
      .catch(error => {
        console.error('Error fetching data:', error);
      });//catch

    }//try
    catch (err) {
      //
      // generally we end up here if we made a 
      // programming error, like undefined variable
      // or function:
      //
      console.log(err.message)
      //res.status(400).json({
      //  "message": err.message
      //});
    }//catch

    //this should be the last line
    //res.render('index', { title: 'Express' });
  });



  module.exports = router;