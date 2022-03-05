var createError = require('http-errors');
var express = require('express');
const session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport')
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')
const User = require('./models/user')

require('dotenv').config()

//Set up default mongoose connection
var mongoDB = process.env.MONGO_URL
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var indexRouter = require('./routes/index');
const boardRouter = require('./routes/board')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(
  new LocalStrategy((username, password, done) => {
      console.log('passport')
      console.log(username)
      User.findOne({ username: username }, (err, user) => {
      console.log(user)
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            return done(null, user)
          } else {
            return done(null, false, { message: "Incorrect password" })
          }
      })    
  });
})
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));

app.use(session({secret: "cats",  resave: false, saveUninitialized: true, }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

app.use(function(req, res, next) {
  console.log(req.user)
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/board', boardRouter)

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
