var express = require('express');
var router = express.Router();
var dbConnection = require('../database.js')


/* GET shopping list */
router.get('/', function(req, res, next) {
    if (req.session.userid) {
        //extract username from session
        username = req.session.username
        //open db connection and hostid using username
        var sql = `
        select s.*, h.username, p.partyname from shoppinglist s
        left join parties p 
        on s.partyid = p.partyid
        left join hosts h
        on h.hostid = p.hostid
        where h.username = ?
        order by timeadded desc;`;

        dbConnection.query(sql, username, (err, results, _) => {
          if (err) {
            throw err;
          }
          else if(results.length === 0){
            res.render('shoppinglist', { shoppingList: 0 });
          }
          else{
            //TO DO:need to handle multiple items
            //this is so that the pug dropdown doesn't display duplicate parties
            parties = []
            partyLoop: for (const item of results){
              if(!parties.includes(item.partyname)){
                parties.push(item.partyname)
              }
            }
            //console.log(parties)
            res.render('shoppinglist', { shoppingList: results, isLoggedin: 'true', username: username, parties: parties});
            //console.log(results)
          }
        });
      }
      else{
        res.render('shoppinglist', { isLoggedin: 'false' }); 
      }
});

/* POST to shopping list form */
router.post('/', function(req, res, next) {
    try {
      if (req.session.userid){
  
        if (req.session.party){
          var partyid = req.session.party.partyid
          console.log("from session",partyid)
        }
        else if (req.body.selectedParty){
          var partyid = parseInt(req.body.selectedParty)
          console.log("from body",partyid)
        }

        console.log('Adding products to database');
        console.log(typeof(req.body.selectedTiles) === 'string')
        console.log(typeof(req.body.selectedTiles))
        //posting a single item will send it as a string, convert to list
        if (typeof(req.body.selectedTiles) === 'string'){
            var results = [JSON.parse(req.body.selectedTiles)] 
        }
        else{var results = req.body.selectedTiles.map(JSON.parse)};
    
        console.log(results)

        var sql = `insert into shoppinglist (productid, category, productname, ingredients, allergens, traces, labels, partyid) values ?`;
        const sql_values = results.map(row => [
            row._id,
            row.category,
            row.product_name,
            row.ingredients_text,
            JSON.stringify(row.allergens_hierarchy), //seriializing arrays into JSON strings
            JSON.stringify(row.traces_hierarchy), //to deserialize when retrieving from DB, use JSON.parse(databaseResult.allergens)
            JSON.stringify(row.labels_hierarchy),
            partyid])

        console.log(sql_values)

        dbConnection.query(sql, [sql_values], (err, results, _) => {
            if (err) {
              throw err;
           }
            console.log("successful insert")
            console.log(results.affectedRows)});
        
       
            res.redirect('/shoppinglist')}//if logged in
      
      else if (!req.session.userid){
          res.redirect('/shoppinglist') //if not logged in
          }    
      //old version
      //else if (req.session.userid && !req.session.party){
      //  res.redirect('/shoppinglist?partyid=false')
      //}
    
      }//try
      catch (error) {
          console.error(error);
          res.status(500).json({ error: 'An error occurred while attempting to add to shopping list' });
        }
});

////this doesn't work but for when you build the DELETE method
/* DELETE items from shopping list */
router.delete('/', function(req, res, next) {
  console.log(req.session.userid)
  try {
    if (req.session.userid){

      console.log('Deleting products from database');
      console.log(typeof(req.body.selectedTiles) === 'string')
      console.log(typeof(req.body.selectedTiles))
      //deleting a single item will send it as a string, convert to list
      if (typeof(req.body.selectedTiles) === 'string'){
          var results = [JSON.parse(req.body.selectedTiles)] 
      }
      else{var results = req.body.selectedTiles.map(JSON.parse)};
  
      console.log(results)

      var sql = `insert into shoppinglist (productid, category, productname, ingredients, allergens, traces, labels, partyid) values ?`;
      const sql_values = results.map(row => [
          row._id,
          row.category,
          row.product_name,
          row.ingredients_text,
          JSON.stringify(row.allergens_hierarchy), //seriializing arrays into JSON strings
          JSON.stringify(row.traces_hierarchy), //to deserialize when retrieving from DB, use JSON.parse(databaseResult.allergens)
          JSON.stringify(row.labels_hierarchy),
          partyid])

      console.log(sql_values)

      //dbConnection.query(sql, [sql_values], (err, results, _) => {
      //    if (err) {
      //      throw err;
      //   }
      //    console.log("successful insert")
      //    console.log(results.affectedRows)});
      
     
          res.redirect('/shoppinglist')}//if logged in
    
    else if (!req.session.userid){
        res.redirect('/shoppinglist') //if not logged in
        }    
  
    }//try
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while attempting to delete from shopping list' });
      }
});

module.exports = router;
