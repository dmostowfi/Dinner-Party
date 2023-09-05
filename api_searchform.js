var express = require('express');
var router = express.Router();

/* GET search form. */

router.get('/', function(req, res, next) {
  if (req.session.userid && req.query.clearparty==='true'){
    //we want to remove the party if the user wants to do a different search
    delete req.session.party;
    res.render('index', 
      { title: 'Dinner Party', 
      isLoggedin: 'true', 
      username: req.session.username});
  }
  else if (req.session.userid && req.session.party){
    res.render('index', 
      { title: 'Dinner Party', 
      isLoggedin: 'true', 
      username: req.session.username,
      party: req.session.party }); //previously index
  }
  else if (req.session.userid && !req.session.party){
    res.render('index', 
      { title: 'Dinner Party', 
      isLoggedin: 'true', 
      username: req.session.username}); //previously index
  }
  else{
    res.render('index', { title: 'Dinner Party', isLoggedin: 'false'})
  }

  });
  

module.exports = router;


//old version delete later
//router.get('/', function(req, res, next) {
//  if (req.session.userid){
//    res.render('index', { title: 'Dinner Party', isLoggedin: 'true', username: req.session.userid }); //previously index
//  }
//  else{
//    res.render('index', { title: 'Dinner Party', isLoggedin: 'false'})
//  }
//  });

