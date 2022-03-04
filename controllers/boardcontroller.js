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
    // GET all messages, check for currentUser
}

exports.message_form_post = (req, res, next) => {
    // GET all messages, check for currentUser
}


