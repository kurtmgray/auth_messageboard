const Message = require('../models/message')
const User = require('../models/user')
const async = require('async')
const { body, validationResult } = require('express-validator')

exports.all_messages_get = (req, res, next) => {
    
    async.parallel({
        messages: (callback) => {
            Message.find().populate('author').exec(callback)
        }
    }, (err, results) => {
        if (err) { return next(err) }
        res.render('board', {title: 'Message Board', messages:results.messages})
    })
    
}

exports.message_form_get = (req, res, next) => {
    res.render('sign-up-form', {title: 'Create New Message'})
}

exports.message_form_post = (req, res, next) => {
    const message = new Message (
        {
            title: req.body.title,
            text: req.body.text,
            timestamp: new Date,
            author: currentUser._id
        }
    )
}


