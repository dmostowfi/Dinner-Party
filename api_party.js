var express = require('express');
var router = express.Router();
var dbConnection = require('../database.js')


/* GET new party form */
router.get('/', function(req, res, next) {
    if (req.session.userid){
        res.render('newpartyform', { isLoggedin: 'true', username: req.session.username, partyadded: 'false' });
      }
      else{
        res.render('newpartyform', { isLoggedin: 'false'})
      }
});

/* POST new party form */
router.post('/', function(req, res, next) {
    try {
        if (req.session.userid){
            console.log('Adding new party to database');
            var hostid = req.session.userid
            console.log(hostid)
            //console.log(typeof(hostid))

            //default values for db are 0
            var milk = 0
            var egg = 0
            var fish = 0
            var peanut = 0
            var treenut = 0
            var soybean = 0
            var gluten = 0
            var sesame = 0
            var vegan = 0
            var vegetarian = 0
            var kosher = 0
            var halal = 0
            var organic = 0

            partyname = req.body.partyname;

            //first, handle allergens
            allergens_param = req.body.allergens
            if(allergens_param === undefined){var user_allergens = []}
            //if 1 allergen entered, push element to empty list
            else if (typeof allergens_param === 'string'){
            var user_allergens = []
            user_allergens.push(allergens_param)}
            //else, rename to user_allergens
            else{
            var user_allergens = allergens_param
            }

            //second, handle dietary preferences
            preferences_param = req.body.preferences
            //error handling if 0-1 preferences entered
            if(preferences_param === undefined){var user_preferences = []}
            else if (typeof preferences_param === 'string'){
            var user_preferences = []
            user_preferences.push(preferences_param)}
            else{
            var user_preferences = preferences_param
            }

            console.log(partyname)
            console.log(user_allergens)  
            console.log(user_preferences)

            //this is strictly for formatting on /searchform when party exists
            var allergenstext = ''
            var prefstext = ''
            if(user_allergens !== undefined || user_allergens.length !== 0){
              user_allergens.forEach((item) => {
                const en_removed = item.substring(3);
                allergenstext += en_removed + ', ';
              });
              allergenstext = allergenstext.substring(0,allergenstext.length - 2); //removes the last comma and white space
              }
            if(user_preferences !== undefined || user_preferences.length !== 0){
              user_preferences.forEach((item) => {
                const en_removed = item.substring(3);
                prefstext += en_removed + ', ';
              });
              prefstext = prefstext.substring(0,prefstext.length - 2);
              }
            console.log(allergenstext)
            console.log(prefstext)
            
            //updating field values for db
            if (user_allergens.includes("en:milk")){var milk = 1}
            if (user_allergens.includes("en:egg")){var egg = 1}
            if (user_allergens.includes("en:fish")){var fish = 1}
            if (user_allergens.includes("en:peanuts")){var peanut = 1}
            if (user_allergens.includes("en:nuts")){var treenut = 1}
            if (user_allergens.includes("en:soybeans")){var soybean = 1}
            if (user_allergens.includes("en:gluten")){var gluten = 1}
            if (user_allergens.includes("en:sesame-seeds")){var sesame = 1}
            if (user_preferences.includes("en:vegan")){var vegan = 1}
            if (user_preferences.includes("en:vegetarian")){var vegetarian = 1}
            if (user_preferences.includes("en:kosher")){var kosher = 1}
            if (user_preferences.includes("en:halal")){var halal = 1}
            if (user_preferences.includes("en:organic")){var organic = 1}

            new_party = [partyname, milk, egg, fish, peanut, treenut, soybean, gluten, sesame, vegan, vegetarian, kosher, halal, organic, hostid]
            var sql = `insert into parties 
            (partyname, milk, egg, fish, peanut, treenut, soybean, gluten, sesame, vegan, vegetarian, kosher, halal, organic, hostid) 
            values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            
            dbConnection.query(sql, new_party, (err, results, _) => {
              if (err && err.code === 'ER_DUP_ENTRY') {
                console.log(err.code)
                res.render('newpartyform', 
                { isLoggedin: 'true',
                msg: `"${partyname}" already exists. Please choose a new name.`})}
              
              else if (err) {
                throw err;
              }
              else if (results.affectedRows === 1){
                console.log("successful insert")
                //caution: probably not the most elegant approach. this might create problems if user adds multiple parties in a session
                //first, attach it to the session so you can access later
                req.session.party = {
                    partyid: results.insertId,
                    partyname: partyname,
                    allergens: user_allergens.join(', '),
                    allergenstext: allergenstext, //this is strictly for formatting on /searchform
                    preferences: user_preferences.join(', '), 
                    prefstext: prefstext//this is strictly for formatting on /searchform
                }

                //then send the same info to the pug template    
                res.render('newpartyform', 
                { isLoggedin: 'true',
                msg: `Successfully created new party "${partyname}"!`, 
                party: {
                    partyid: results.insertId,
                    partyname: partyname,
                    allergens: user_allergens, 
                    preferences: user_preferences}}
                    )
                }
                console.log(req.session)
            });

        }//if user is logged in

        else{
            res.render('newpartyform', { isLoggedin: 'false'});
        }
    

      }//try
      catch (error) {
          console.error(error);
          res.status(500).json({ error: 'An error occurred while attempting to create a new party' });
        }
});

module.exports = router;


