
var express = require('express');
var router = express.Router();
var dbConnection = require('../database.js')

/* GET parties . */
router.get('/', function(req, res, next) {
  try {
    if (req.session.userid){
      console.log('Querying db for parties');
      var hostid = req.session.userid
      console.log(hostid)

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
      res.status(500).json({ error: 'An error occurred while fetching parties' });
    }
  });

  module.exports = router;