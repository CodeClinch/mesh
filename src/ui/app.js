var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const log = require("./log.js");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authz = require('./routes/authz');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.bodyParser());

// log headers
app.use(function(req, res, next) {
  log.info("----- New request ------");
  log.info(`Request headers: ${JSON.stringify(req.headers)}`);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/authz', authz);

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
