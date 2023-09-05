
var express = require('express');
var router = express.Router();
var dbConnection = require('../database.js')

/* GET categories . */
router.get('/', function(req, res, next) {

  try {

    console.log('Accessing the autofill route');
    category = req.query.category;
    console.log(category)

    var sql = `SELECT generic_name FROM categories WHERE generic_name LIKE ? LIMIT 10;`;
    dbConnection.query(sql, [`%${category}%`], (err, results, _) => {
      if (err) {
        throw err;
      }
    var formattedResults = results.map(row => row.generic_name);
    res.json(formattedResults)
    });
  }//try
  catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching suggestions' });
    }
  });

  module.exports = router;