const Message = require('../models/message')
const User = require('../models/user')
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')

passport.use(
    
    new LocalStrategy((username, password, done) => {
        console.log('passport')
        User.findOne({ username: username }, (err, user) => {
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

passport.serializeUser(function(user, done) {
  process.nextTick(() => {
    done(null, user.id);
  })
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

exports.sign_up_form_get = (req, res, next) => {
    res.render('sign-up-form', { title: 'Sign Up Form'})

}

exports.sign_up_form_post = (req, res, next) => {
    const user = new User(
        {
            username: req.body.username,
            password: req.body.password,
            fname: req.body.fname,
            lname: req.body.lname,
            memberStatus: false
        }
    )
    bcrypt.hash(user.password, 10, (err, hashedPassword) => {
        // if err, do something
        if (err) { return next(err) }
        // otherwise, store hashedPassword in DB
        user.password = hashedPassword
        user.save(err => {
            if (err) { return next(err) }
            res.redirect('/')
        })
    });
    
}

exports.log_in_get = (req, res, next) => {
    res.render('log-in-form', {title: 'Log In'})
}

exports.log_in_post = (req, res, next) => {
    passport.authenticate("local", {
      successReturnToOrRedirect: '/',
      failureRedirect: '/log-in',
      failureMessage: true
      })
}
