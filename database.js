//
// database.js
//
// Exports 
// dbConnection: connection object to our MySQL database in AWS RDS
//

const mysql = require('mysql');
//const fs = require('fs');
//const ini = require('ini');

const config = require('./config/config.js');
const db = config.database;

//const ee_config = ini.parse(fs.readFileSync(config.ee_config, 'utf-8'));
const endpoint = db.endpoint;
const port_number = db.port_number;
const user_name = db.username;
const user_pwd = db.password;
const db_name = db.db_name;

//
// creates connection object, but doesn't open connnection:
//
let dbConnection = mysql.createConnection(
  {
    host: endpoint,
    port: port_number,
    user: user_name,
    password: user_pwd,
    database: db_name,
    multipleStatements: true  // allow multiple queries in one call
  }
);


module.exports = dbConnection;
