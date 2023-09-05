var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  if (req.session.userid) {
    //console.log("logged in:",req.session.userid)
    res.render('home', { title: 'Dinner Party', isLoggedin: 'true', username: req.session.username });
  }
  else{
    res.render('home', { title: 'Dinner Party', isLoggedin: 'false' }); //previously index
  }
  });
  

module.exports = router;
