var express = require('express');
var router = express.Router();
var dbConnection = require('../database.js')


/* GET new user form */
router.get('/', function(req, res, next) {
    res.render('newuserform');
});

/* POST new user form */
router.post('/', function(req, res, next) {
    try {

        //TO DO: check if user already exists
        //conditional - only send success message if affected rows = 1
        console.log('Adding new user to database');
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
    
        console.log(email)
        console.log(username)
        console.log(password)
    
        var sql_insert = `insert into hosts (email, username, pw) values(?, ?, ?);`;
        new_user = [email, username, password]
        
        dbConnection.query(sql_insert, new_user, (err, results, _) => {
          if (err && err.code === 'ER_DUP_ENTRY') {
            console.log(err.code)
            res.render('loginform', { msg: 'Account already exists. Please log in or try again' })
          }
          else if (err) {
            throw err;
          }
          else{
            if(results.affectedRows === 1){
              console.log("successful insert")
              res.render('loginform', { msg: 'Account successfully created! Please log in' })
            }
          }
        });


      }//try
      catch (error) {
          console.error(error);
          res.status(500).json({ error: 'An error occurred while attempting to create a new user' });
        }
});

module.exports = router;
