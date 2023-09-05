var express = require('express');
var router = express.Router();
var dbConnection = require('../database.js')

// if there's no hidden params, show form
//if hidden params, check db for user


/* GET login form */
router.get('/', function(req, res, next) {
  if(!req.session.userid){}
  res.render('loginform', { msg: 'Please log in' });
});

/* POST login */
router.post('/', function(req, res, next) {

  //extract user-entered credentials
  var username = req.body.username
  var password = req.body.password

  //check if matches creds in DB
  user_creds = [username, password]
  var sql = `select * from hosts where username = ? and pw = ?;`;

  dbConnection.query(sql, user_creds, (err, results, _) => {
    if (err) {
      throw err;
    }
    //if one or both creds don't match
    else if (results.length === 0){
      res.render('loginform', { msg: 'Invalid username or password. Please try again.'})
      //res.render('loginform', { msg: 'Invalid username or password. Please try again.'})
    }
    else{
      session = req.session
      //console.log(req.sessionID)
      session.username=username; //attaching a username to the session
      session.userid=results[0].hostid; //attaching a userid to the session
      console.log(session)
      return res.redirect('/'); //TODO: redirect back to create dinner party
    }
    console.log(results)
  });

});

module.exports = router;
