
var express = require('express');
var router = express.Router();
var dbConnection = require('../database.js')

/* DELETE items . */
router.delete('/', function(req, res, next) {
  try {
    if (req.session.userid){
      console.log('Querying db...');
      var hostid = req.session.userid

      var sql = `select * from parties where hostid=?;`;
      dbConnection.query(sql, hostid, (err, results, _) => {
        if (err) {
          throw err;
        }
      var formattedResults = results.map(row => ({
        partyid: row.partyid, 
        partyname: row.partyname
      }));
      console.log(formattedResults)
      res.json(formattedResults)
      });
    }
  }//try
  catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while trying to delete items' });
    }
  });

  module.exports = router;