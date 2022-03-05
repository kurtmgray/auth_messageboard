const User = require('../models/user')
const passport = require("passport");
const { body, validationResult } = require('express-validator')
const { currentUser } = require('../app')



exports.sign_up_form_get = (req, res, next) => {
    res.render('sign-up-form', { title: 'Sign Up Form'})

}

exports.sign_up_form_post = [
  
  body('fname').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
  body('lname').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.')
    .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
  body('username').trim().isLength({ min: 1 }).escape().withMessage('Username must be specified.')
    .isAlphanumeric().withMessage('Username has non-alphanumeric characters.'),
  body('password').trim().isLength({ min: 6 }).escape().withMessage('Password must be at least 6 characters.'),
  
(req, res, next) => {
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) { 
    res.render('sign-up-form', { title: 'Sign Up Form', errors: errors, data: req.body})
  }
  else {  
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
}]

exports.log_in_get = (req, res, next) => {
    res.render('log-in-form', {title: 'Log In'})
}

exports.log_in_post = 
    passport.authenticate("local", {
      successReturnToOrRedirect: '/',
      failureRedirect: '/log-in',
      failureMessage: true
    })

exports.log_out_get = (req, res, next) => {
  req.logout()
  res.redirect('/')
}