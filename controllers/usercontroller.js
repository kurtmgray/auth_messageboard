const Message = require('../models/message')
const User = require('../models/user')

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')

passport.use(
    new LocalStrategy((username, password, done) => {
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
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});  

exports.sign_up_form_get = (req, res, next) => {
    res.render('sign-up', { title: 'Sign Up Form'})

}

exports.sign_up_form_post = (req, res, next) => {
    const user = new User(
        {
            username: req.body.username,
            password: req.body.password
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
    res.render('login', {title: 'Log In'})
}

exports.log_in_post = (req, res, next) => {
    
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
      })


}

module.exports = passport