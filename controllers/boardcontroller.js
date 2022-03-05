const Message = require('../models/message')
const async = require('async')
const { body, validationResult } = require('express-validator')

exports.all_messages_get = (req, res, next) => {
    
    async.parallel({
        messages: (callback) => {
            Message.find().populate('author').exec(callback)
        },
    }, (err, results) => {
        if (err) { return next(err) }

        res.render('board', {title: 'Message Board', messages: results.messages, currentUser: res.locals.currentUser })
    })
    
}

exports.message_form_get = (req, res, next) => {
    console.log('21' + res.locals.currentUser)
    res.render('new-message-form', {title: 'Create New Message', currentUser: res.locals.currentUser})
}

exports.message_form_post = [
    
    body('title').trim().isLength({ min: 1 }).withMessage('Title must be specified.'),
    body('message').trim().isLength({ min: 1 }).withMessage('Title must be specified.'),

    (req, res, next) => {
        
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            res.render('new-message-form', {title: 'Create New Message', errors: errors, data: req.body})
        }
        else {
            const message = new Message (
                {
                    title: req.body.title,
                    text: req.body.message,
                    timestamp: new Date,
                    author: res.locals.currentUser._id
                }
            )
            message.save(err => {
                if (err) {return next(err) }
                res.redirect('/')
            })
        }    
    }
]


