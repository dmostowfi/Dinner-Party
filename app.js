var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); //allows the server to access the necessary option to save, read and access a cookie
var logger = require('morgan');
var sessions = require('express-session');
var config = require('./config/config.js');
var config_db = config.database;
var config_session = config.session;
var mysqlStore = require('express-mysql-session')(sessions);


var indexRouter = require('./routes/index');
var loginRouter = require('./routes/api_login');
var logoutRouter = require('./routes/api_logout');
var newuserRouter = require('./routes/api_newuser');
var autofillRouter = require('./routes/api_autofill.js');
var productsRouter = require('./routes/api_products');
var searchformRouter = require('./routes/api_searchform');
var shoppinglistRouter = require('./routes/api_shoppinglist');
var createpartyRouter = require('./routes/api_party');
var getpartiesRouter = require('./routes/api_getparties');


var app = express(); //creates Express app instance
//Once you have created the Express application instance, you can use 
//app to configure various aspects of your application, such as 
//defining routes, middleware, and view engines.

//Setting up the session middleware
//create an instance of the MySQL store
var sessionStore = new mysqlStore({
  host: config_db.endpoint,
  user: config_db.username,
  password: config_db.password,
  database: config_db.db_name, 
  createDatabaseTable: false
});

//used this to check if database was properly accessed
sessionStore.onReady().then(() => {
	// MySQL session store ready for use.
	console.log('MySQLStore ready');
}).catch(error => {
	// Something went wrong.
	console.error(error);})


//To make sure the incoming request has a session, put the session middleware before all of the routes. 
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: config_session.secret,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false, 
    store: sessionStore
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));// sets the directory where the view templates are located
//path.join is the value that defines the path to the "views" directory
app.set('view engine', 'pug'); //specifies that the app will use the Pug view engine to process and render the templates.

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//product search routes
app.use('/searchform', searchformRouter);
app.use('/search', productsRouter);
app.use('/search', (req, res, next) => {
  console.log('Request to /search:', req.method, req.url);
  next();
});
app.use('/autofill', autofillRouter)
app.use('/addtolist', shoppinglistRouter)
app.use('/shoppinglist', shoppinglistRouter)
//app.use('/deleteitem', shoppinglistRouter)

//user session routes
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/createuser', newuserRouter);
app.use('/newparty', createpartyRouter);
app.use('/getparties', getpartiesRouter);
app.use('/', indexRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
